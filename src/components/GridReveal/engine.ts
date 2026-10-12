/*
 * @Description: GridReveal 的 canvas 揭幕引擎（纯逻辑，不依赖 React）
 *
 * 从组件拆出的可单测部分：buildTree 切分格子树、measureTree 采样图片颜色、
 * orderByDetail 按细节量重排揭示顺序、drawScene 逐帧绘制、readAverages
 * 把图片画到采样画布取平均色。组件（同目录 index.tsx）只保留
 * DOM / rAF / IntersectionObserver 编排
 */

/** 叶子格子总数 */
export const CELLS = 180;
/** 开局即处于分裂态的格子数（负 splitAt） */
export const OPENING_CELLS = 4;
/** 无图时自走 pace 的上限比例 */
export const HOLD = 0.9;
/** 图片未就绪时 split 的等待上限 */
export const WAIT_CAP = 0.72;
/** 最后一个分支的分裂时机 */
export const LAST_SPLIT = 0.92;
/** 一次分裂形变的时长（split 单位） */
export const MORPH = 0.055;
/** 颜色采样画布的边长 */
export const SAMPLE = 128;
/** 图片就绪后整体颜色淡入时长（ms） */
export const COLOR_MS = 420;
/** 格子缝隙从多大 split 开始收敛 */
export const GUTTER_FROM = 0.35;
/** 缝隙收敛完成时机 */
export const GUTTER_TO = 0.75;
/** 照片从多大 split 开始淡入 */
export const PHOTO_FROM = 0.93;

export type Cell = {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  g: number;
  b: number;
  tone: number;
  detail: number;
  splitAt: number;
  parent: Cell | null;
  kids: [Cell, Cell] | null;
};

export type Sums = {
  n: number;
  r: number;
  g: number;
  b: number;
  l: number;
  l2: number;
};

export type Scene = {
  ctx: CanvasRenderingContext2D;
  root: Cell;
  width: number;
  height: number;
  scale: number;
  dark: boolean;
  clock: number;
  split: number;
  fade: number;
  hasColors: boolean;
  image: HTMLImageElement | null;
};

export type Patch = {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  g: number;
  b: number;
  tone: number;
};

export const clamp01 = (n: number) => (n > 0 ? (n < 1 ? n : 1) : 0);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));

  return t * t * (3 - 2 * t);
}

export function selfPaced(elapsed: number, duration: number) {
  const span = duration > 0 ? duration : 1;

  return HOLD * (1 - Math.exp(-elapsed / span));
}

function hash(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;

  return n - Math.floor(n);
}

function makeCell(
  x: number,
  y: number,
  w: number,
  h: number,
  parent: Cell | null,
): Cell {
  return {
    x,
    y,
    w,
    h,
    r: 0,
    g: 0,
    b: 0,
    tone: hash(x + 3.1, y + 1.7, w * 31.7),
    detail: 0,
    splitAt: 0,
    parent,
    kids: null,
  };
}

/** 按面积优先二分切出格子树：叶子总数固定为 CELLS */
export function buildTree(aspect: number) {
  const root = makeCell(0, 0, 1, 1, null);
  const leaves: Cell[] = [root];
  const branches: Cell[] = [];

  while (leaves.length < CELLS) {
    let pick = 0;
    let widest = -1;

    for (let i = 0; i < leaves.length; i++) {
      const cell = leaves[i];
      const area =
        cell.w * aspect * cell.h * (1 + 0.12 * hash(cell.x, cell.y, 7.3));

      if (area > widest) {
        widest = area;
        pick = i;
      }
    }

    const parent = leaves.splice(pick, 1)[0];
    const wide = parent.w * aspect >= parent.h;
    const half = wide ? parent.w / 2 : parent.h / 2;
    const a = wide
      ? makeCell(parent.x, parent.y, half, parent.h, parent)
      : makeCell(parent.x, parent.y + half, parent.w, half, parent);
    const b = wide
      ? makeCell(parent.x + half, parent.y, half, parent.h, parent)
      : makeCell(parent.x, parent.y + half, parent.w, half, parent);

    parent.kids = [a, b];
    branches.push(parent);
    leaves.push(a, b);
  }

  const opening = OPENING_CELLS - 1;
  const rest = Math.max(1, branches.length - opening);

  branches.forEach((cell, index) => {
    cell.splitAt =
      index < opening ? -MORPH : (LAST_SPLIT * (index - opening + 1)) / rest;
  });

  return { root, branches };
}

/** 自底向上汇总每个格子的平均色与细节量（亮度方差） */
export function measureTree(root: Cell, pixels: Uint8ClampedArray, size: number) {
  const gather = (cell: Cell): Sums => {
    let sums: Sums;

    if (cell.kids) {
      const a = gather(cell.kids[0]);
      const b = gather(cell.kids[1]);

      sums = {
        n: a.n + b.n,
        r: a.r + b.r,
        g: a.g + b.g,
        b: a.b + b.b,
        l: a.l + b.l,
        l2: a.l2 + b.l2,
      };
    } else {
      sums = { n: 0, r: 0, g: 0, b: 0, l: 0, l2: 0 };
      // 边缘格子的边界四舍五入后会顶到/越出画布尺寸：起点夹到最后一像素，
      // 终点夹回画布内且保证至少采样一像素——否则会把 undefined 读进求和
      // （原实现此处会产出 NaN 颜色，整条祖先链跟着坏）
      const x0 = Math.min(size - 1, Math.round(cell.x * size));
      const y0 = Math.min(size - 1, Math.round(cell.y * size));
      const x1 = Math.max(
        x0 + 1,
        Math.min(size, Math.round((cell.x + cell.w) * size)),
      );
      const y1 = Math.max(
        y0 + 1,
        Math.min(size, Math.round((cell.y + cell.h) * size)),
      );

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const index = (y * size + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const l = 0.299 * r + 0.587 * g + 0.114 * b;

          sums.n++;
          sums.r += r;
          sums.g += g;
          sums.b += b;
          sums.l += l;
          sums.l2 += l * l;
        }
      }
    }

    const n = sums.n || 1;

    cell.r = sums.r / n;
    cell.g = sums.g / n;
    cell.b = sums.b / n;
    cell.detail = Math.max(0, sums.l2 / n - (sums.l / n) * (sums.l / n));

    return sums;
  };

  gather(root);
}

/** 细节量大的分支优先占早揭示时段（保持时段集合不变，只重排归属） */
export function orderByDetail(branches: Cell[], openedBefore: number) {
  const pending = branches.filter((cell) => cell.splitAt > openedBefore);

  if (pending.length < 2) return;

  const slots = pending.map((cell) => cell.splitAt).sort((a, b) => a - b);
  const queue = pending.filter(
    (cell) => !cell.parent || cell.parent.splitAt <= openedBefore,
  );

  let next = 0;

  while (queue.length && next < slots.length) {
    let pick = 0;

    for (let i = 1; i < queue.length; i++) {
      if (queue[i].detail > queue[pick].detail) {
        pick = i;
      }
    }

    const cell = queue.splice(pick, 1)[0];

    cell.splitAt = slots[next++];

    for (const kid of cell.kids ?? []) {
      if (kid.kids) {
        queue.push(kid);
      }
    }
  }
}

/** 图片以 cover 方式铺满目标矩形的绘制参数（居中裁剪） */
export function coverRect(iw: number, ih: number, w: number, h: number) {
  const scale = Math.max(w / iw, h / ih);

  return {
    dx: (w - iw * scale) / 2,
    dy: (h - ih * scale) / 2,
    dw: iw * scale,
    dh: ih * scale,
  };
}

function greyOf(tone: number, dark: boolean, clock: number) {
  return (
    (dark ? 30 : 228) + tone * 13 + Math.sin(clock * 1.5 + tone * 6.28) * 3
  );
}

/** 逐帧绘制：灰底格子按 split 进度分裂/形变，照片在尾部淡入 */
export function drawScene(scene: Scene) {
  const { ctx, root, width, height, split } = scene;
  const tint = scene.hasColors ? scene.fade : 0;
  const shade = (grey: number, target: number) =>
    Math.round(mix(grey, target, tint));
  const base = greyOf(root.tone, scene.dark, scene.clock);

  ctx.fillStyle = `rgb(${Math.round(shade(base, root.r) * 0.92)},${Math.round(
    shade(base, root.g) * 0.92,
  )},${Math.round(shade(base, root.b) * 0.92)})`;
  ctx.fillRect(0, 0, width, height);

  const soft = 1 - smoothstep(GUTTER_FROM, GUTTER_TO, split);
  const gutter = scene.scale * soft;
  const rounded = soft > 0.01 && typeof ctx.roundRect === "function";

  const paint = (patch: Patch) => {
    const x = Math.round(patch.x);
    const y = Math.round(patch.y);
    const w = Math.round(patch.x + patch.w) - x;
    const h = Math.round(patch.y + patch.h) - y;

    const onLeft = x <= 0;
    const onTop = y <= 0;
    const onRight = x + w >= width;
    const onBottom = y + h >= height;

    const left = onLeft ? 0 : gutter;
    const top = onTop ? 0 : gutter;
    const innerW = w - left - (onRight ? 0 : gutter);
    const innerH = h - top - (onBottom ? 0 : gutter);

    if (innerW <= 0 || innerH <= 0) return;

    const grey = greyOf(patch.tone, scene.dark, scene.clock);

    ctx.fillStyle = `rgb(${shade(grey, patch.r)},${shade(grey, patch.g)},${shade(
      grey,
      patch.b,
    )})`;

    if (rounded) {
      const radius = Math.min(innerW, innerH) * 0.12 * soft;

      ctx.beginPath();
      ctx.roundRect(x + left, y + top, innerW, innerH, [
        !onLeft && !onTop ? radius : 0,
        !onRight && !onTop ? radius : 0,
        !onRight && !onBottom ? radius : 0,
        !onLeft && !onBottom ? radius : 0,
      ]);
      ctx.fill();
    } else {
      ctx.fillRect(x + left, y + top, innerW, innerH);
    }
  };

  const walk = (cell: Cell, patch: Patch) => {
    if (!cell.kids || split < cell.splitAt) {
      paint(patch);

      return;
    }

    const t = easeOut(clamp01((split - cell.splitAt) / MORPH));

    for (const kid of cell.kids) {
      walk(kid, {
        x: mix(patch.x, kid.x * width, t),
        y: mix(patch.y, kid.y * height, t),
        w: mix(patch.w, kid.w * width, t),
        h: mix(patch.h, kid.h * height, t),
        r: mix(patch.r, kid.r, t),
        g: mix(patch.g, kid.g, t),
        b: mix(patch.b, kid.b, t),
        tone: mix(patch.tone, kid.tone, t),
      });
    }
  };

  walk(root, {
    x: 0,
    y: 0,
    w: width,
    h: height,
    r: root.r,
    g: root.g,
    b: root.b,
    tone: root.tone,
  });

  if (!scene.image) return;

  const photo = scene.hasColors
    ? smoothstep(PHOTO_FROM, 1, split) * scene.fade
    : scene.fade;

  if (photo <= 0.002) return;

  const fit = coverRect(
    scene.image.naturalWidth,
    scene.image.naturalHeight,
    width,
    height,
  );

  ctx.globalAlpha = photo;
  ctx.drawImage(scene.image, fit.dx, fit.dy, fit.dw, fit.dh);
  ctx.globalAlpha = 1;
}

/**
 * 把图片画到 SAMPLE 尺寸的离屏画布并回填格子平均色。
 * 跨域图片被浏览器污染画布时 getImageData 抛错，返回 false，
 * 由调用方退回灰色揭幕（照片仍会在尾部淡入）
 */
export function readAverages(
  image: HTMLImageElement,
  root: Cell,
  branches: Cell[],
  at: number,
) {
  const buffer = document.createElement("canvas");

  buffer.width = SAMPLE;
  buffer.height = SAMPLE;

  const ctx = buffer.getContext("2d", { willReadFrequently: true });

  if (!ctx) return false;

  const fit = coverRect(
    image.naturalWidth,
    image.naturalHeight,
    SAMPLE,
    SAMPLE,
  );

  ctx.drawImage(image, fit.dx, fit.dy, fit.dw, fit.dh);

  try {
    measureTree(root, ctx.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE);
    orderByDetail(branches, at);

    return true;
  } catch {
    return false;
  }
}

/** 组件侧的场景对象工厂：屏蔽 Scene 的初始字段 */
export function createScene(
  ctx: CanvasRenderingContext2D,
  root: Cell,
): Scene {
  return {
    ctx,
    root,
    width: 0,
    height: 0,
    scale: 1,
    dark: false,
    clock: 0,
    split: 0,
    fade: 0,
    hasColors: false,
    image: null,
  };
}
