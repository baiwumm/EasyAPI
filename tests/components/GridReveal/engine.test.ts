// @vitest-environment jsdom
/*
 * GridReveal canvas 引擎单测（F7 拆分的纯模块）：
 * buildTree 切分 / measureTree 颜色汇总 / orderByDetail 揭示排序 /
 * drawScene 绘制 / readAverages 采样与跨域降级 / 纯数学助手。
 * 画布用记录型 stub 上下文，不依赖真实渲染
 */
import {
  buildTree,
  clamp01,
  coverRect,
  createScene,
  drawScene,
  measureTree,
  orderByDetail,
  readAverages,
  selfPaced,
  smoothstep,
  CELLS,
  COLOR_MS,
  HOLD,
  OPENING_CELLS,
  WAIT_CAP,
  type Cell,
  type Scene,
} from "@/components/GridReveal/engine";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/** 数叶子格子 */
function countLeaves(cell: Cell): number {
  return cell.kids
    ? countLeaves(cell.kids[0]) + countLeaves(cell.kids[1])
    : 1;
}

/** 树签名：只序列几何与时机（parent 是循环引用，不能进 JSON） */
function treeSignature(aspect: number): string {
  const sig = (cell: Cell): string =>
    cell.kids
      ? `(${sig(cell.kids[0])}|${sig(cell.kids[1])})`
      : `[${cell.x},${cell.y},${cell.w},${cell.h},${cell.tone}]`;

  return sig(buildTree(aspect).root);
}

/** 记录型 2D 上下文 stub */
function stubCtx() {
  const calls: string[] = [];

  return {
    calls,
    fillStyle: "",
    globalAlpha: 1,
    beginPath: () => calls.push("beginPath"),
    drawImage: (...args: unknown[]) =>
      calls.push(`drawImage:${args.slice(1).join(",")}`),
    fill: () => calls.push("fill"),
    fillRect: (...args: number[]) => calls.push(`fillRect:${args.join(",")}`),
    roundRect: (...args: number[]) =>
      calls.push(`roundRect:${args.slice(0, 4).join(",")}`),
  };
}

const asCtx = (stub: ReturnType<typeof stubCtx>) =>
  stub as unknown as CanvasRenderingContext2D;

function testCell(partial: Partial<Cell> = {}): Cell {
  return {
    x: 0,
    y: 0,
    w: 0.5,
    h: 0.5,
    r: 0,
    g: 0,
    b: 0,
    tone: 0,
    detail: 0,
    splitAt: 1,
    parent: null,
    kids: null,
    ...partial,
  };
}

/** 4x4 采样画布：左半红、右半蓝 */
function halfRedHalfBlue(size: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      if (x < size / 2) {
        pixels[i] = 255;
      } else {
        pixels[i + 2] = 255;
      }
      pixels[i + 3] = 255;
    }
  }

  return pixels;
}

describe("buildTree", () => {
  it("切出固定数量的叶子与分支，全部落在单位方格内", () => {
    const { root, branches } = buildTree(1);

    expect(countLeaves(root)).toBe(CELLS);
    expect(branches).toHaveLength(CELLS - 1);

    const stack: Cell[] = [root];

    while (stack.length) {
      const cell = stack.pop()!;

      expect(cell.x).toBeGreaterThanOrEqual(0);
      expect(cell.y).toBeGreaterThanOrEqual(0);
      expect(cell.x + cell.w).toBeLessThanOrEqual(1.000001);
      expect(cell.y + cell.h).toBeLessThanOrEqual(1.000001);
      if (cell.kids) stack.push(cell.kids[0], cell.kids[1]);
    }
  });

  it("开局格子负 splitAt 先裂，其余分支均布在 (0, LAST_SPLIT]", () => {
    const { branches } = buildTree(1.5);
    const opening = branches.filter((cell) => cell.splitAt < 0);
    const rest = branches.filter((cell) => cell.splitAt > 0);

    expect(opening).toHaveLength(OPENING_CELLS - 1);
    expect(rest.length).toBe(branches.length - opening.length);
    for (const cell of rest) {
      expect(cell.splitAt).toBeGreaterThan(0);
      expect(cell.splitAt).toBeLessThanOrEqual(0.92);
    }
  });

  it("同 aspect 输出逐字节一致（确定性）", () => {
    expect(treeSignature(1)).toBe(treeSignature(1));
    expect(treeSignature(1)).not.toBe(treeSignature(2));
  });
});

describe("coverRect", () => {
  it("同比例时铺满且无偏移", () => {
    expect(coverRect(100, 100, 100, 100)).toEqual({
      dx: 0,
      dy: 0,
      dw: 100,
      dh: 100,
    });
  });

  it("宽图进方框：按高度放大、水平居中裁剪", () => {
    expect(coverRect(200, 100, 100, 100)).toEqual({
      dx: -50,
      dy: 0,
      dw: 200,
      dh: 100,
    });
  });

  it("竖图进宽框：按宽度放大、垂直居中裁剪", () => {
    // scale = max(200/100, 100/200) = 2 → dw=200 dh=400，dy 负向居中
    expect(coverRect(100, 200, 200, 100)).toEqual({
      dx: 0,
      dy: -150,
      dw: 200,
      dh: 400,
    });
  });
});

describe("纯数学助手", () => {
  it("clamp01 把输入夹到 [0,1]", () => {
    expect(clamp01(-5)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(9)).toBe(1);
  });

  it("smoothstep 区间外饱和、区间内单调", () => {
    expect(smoothstep(0, 10, -1)).toBe(0);
    expect(smoothstep(0, 10, 11)).toBe(1);
    expect(smoothstep(0, 10, 5)).toBeCloseTo(0.5);
    expect(smoothstep(0, 10, 7)).toBeGreaterThan(smoothstep(0, 10, 3));
  });

  it("selfPaced 从 0 渐近到 HOLD，时长非正时也安全", () => {
    expect(selfPaced(0, 1600)).toBe(0);
    expect(selfPaced(1600, 1600)).toBeCloseTo(HOLD * (1 - Math.exp(-1)));
    // 渐近逼近但不超过 HOLD；足够大时浮点上等于 HOLD
    expect(selfPaced(1e6, 1600)).toBeLessThanOrEqual(HOLD);
    expect(selfPaced(1e6, 1600)).toBeGreaterThan(selfPaced(1600, 1600));
    expect(selfPaced(100, 0)).toBeLessThanOrEqual(HOLD);
  });
});

describe("measureTree", () => {
  it("手工左右两半树：精确汇总平均色与叶子色", () => {
    const left = testCell({ x: 0, y: 0, w: 0.5, h: 1 });
    const right = testCell({ x: 0.5, y: 0, w: 0.5, h: 1 });
    const root = testCell({ x: 0, y: 0, w: 1, h: 1, kids: [left, right] });

    measureTree(root, halfRedHalfBlue(4), 4);

    // 左半 (255,0,0) 右半 (0,0,255) → 根平均 (127.5, 0, 127.5)
    expect(root.r).toBeCloseTo(127.5);
    expect(root.g).toBe(0);
    expect(root.b).toBeCloseTo(127.5);
    expect(left.r).toBe(255);
    expect(left.b).toBe(0);
    expect(right.b).toBe(255);
    // 双色分布 → 亮度方差大于 0
    expect(root.detail).toBeGreaterThan(0);
  });

  it("真实 180 格树：边缘格子不越界、全树颜色有限（夹紧回归）", () => {
    const { root } = buildTree(1);
    const cells: Cell[] = [];
    const walk = (cell: Cell) => {
      cells.push(cell);
      if (cell.kids) {
        walk(cell.kids[0]);
        walk(cell.kids[1]);
      }
    };

    measureTree(root, halfRedHalfBlue(4), 4);
    walk(root);

    for (const cell of cells) {
      for (const channel of [cell.r, cell.g, cell.b, cell.detail]) {
        expect(Number.isFinite(channel)).toBe(true);
        expect(channel).toBeGreaterThanOrEqual(0);
      }
      expect(cell.r).toBeLessThanOrEqual(255);
    }
    // 双色图：根有方差、绿色通道为 0
    expect(root.detail).toBeGreaterThan(0);
    expect(root.g).toBe(0);
  });

  it("纯色图 detail 为 0", () => {
    const { root } = buildTree(1);
    const white = new Uint8ClampedArray(16 * 16 * 4).fill(255);

    measureTree(root, white, 16);

    expect(root.detail).toBe(0);
    expect(root.r).toBe(255);
  });
});

describe("orderByDetail", () => {
  it("时段集合不变，细节量大的合格分支优先占早时段", () => {
    const kid = testCell({ kids: [testCell(), testCell()] });
    const a = testCell({ detail: 1, splitAt: 0.5, kids: [kid, testCell()] });
    const b = testCell({ detail: 5, splitAt: 0.6 });
    const c = testCell({ detail: 9, splitAt: 0.7, parent: a });
    const branches = [a, b, c];
    const before = branches.map((cell) => cell.splitAt).sort((x, y) => x - y);

    orderByDetail(branches, 0);

    // 时段多重集合不变（只重排归属）
    expect(branches.map((cell) => cell.splitAt).sort((x, y) => x - y)).toEqual(
      before,
    );
    // b 细节量最高且合格（无父或父已开）→ 拿到最早时段
    expect(b.splitAt).toBe(0.5);
    // c 的父 a 尚未开 → c 本轮不参与，保持原时段
    expect(c.splitAt).toBe(0.7);
  });

  it("不足两个待排分支时直接返回", () => {
    const only = testCell({ detail: 3, splitAt: 0.5 });

    orderByDetail([only], 0);
    expect(only.splitAt).toBe(0.5);
  });
});

describe("drawScene", () => {
  const makeScene = (over: Partial<Scene> = {}): Scene => {
    const { root } = buildTree(1);

    return {
      ...createScene(asCtx(stubCtx()), root),
      width: 100,
      height: 50,
      ...over,
    };
  };

  it("split=0 无图：铺底色 + 只画 4 个开局大格，不画照片", () => {
    const stub = stubCtx();
    const scene = makeScene();

    scene.ctx = asCtx(stub);
    drawScene(scene);

    expect(stub.calls[0]).toBe("fillRect:0,0,100,50");
    // OPENING_CELLS=4：起始态整图就是 4 个格子
    expect(stub.calls.filter((c) => c === "fill").length).toBe(4);
    // 缝隙未收敛 → 走圆角路径
    expect(stub.calls).toContain("beginPath");
    expect(stub.calls.some((c) => c.startsWith("roundRect:"))).toBe(true);
    expect(stub.calls.some((c) => c.startsWith("drawImage"))).toBe(false);
  });

  it("split=1 照片就绪：按 cover 矩形绘制并还原 globalAlpha", () => {
    const stub = stubCtx();
    const scene = makeScene({
      split: 1,
      fade: 1,
      hasColors: true,
      image: { naturalWidth: 200, naturalHeight: 100 } as HTMLImageElement,
    });

    scene.ctx = asCtx(stub);
    drawScene(scene);

    // coverRect(200,100,100,50)：scale=0.5 → 刚好铺满无裁剪
    expect(stub.calls).toContain("drawImage:0,0,100,50");
    expect(stub.globalAlpha).toBe(1);
  });

  it("暗色模式底色更暗", () => {
    const light = stubCtx();
    const dark = stubCtx();
    const base = buildTree(1).root;
    const lightScene = { ...makeScene(), ctx: asCtx(light), dark: false };
    const darkScene = { ...makeScene(), ctx: asCtx(dark), dark: true };

    drawScene(lightScene);
    drawScene(darkScene);

    const brightness = (s: typeof light) => {
      const [r, g, b] = s.fillStyle.match(/\d+/g)!.map(Number);

      return r + g + b;
    };

    expect(brightness(dark)).toBeLessThan(brightness(light));
    expect(base.tone).toBeGreaterThanOrEqual(0);
  });

  it("照片淡入未开始（fade=0）时不画照片", () => {
    const stub = stubCtx();
    const scene = makeScene({
      split: 0.5,
      fade: 0,
      hasColors: true,
      image: { naturalWidth: 10, naturalHeight: 10 } as HTMLImageElement,
    });

    scene.ctx = asCtx(stub);
    drawScene(scene);

    expect(stub.calls.some((c) => c.startsWith("drawImage"))).toBe(false);
  });
});

describe("readAverages", () => {
  const realGetContext = HTMLCanvasElement.prototype.getContext;

  beforeAll(() => {
    // jsdom 无 canvas 包：默认 getContext 返回 null 且打噪音，直接打桩
    HTMLCanvasElement.prototype.getContext = (() => null) as never;
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = realGetContext;
  });

  it("拿不到 2D 上下文时返回 false（调用方退灰色揭幕）", () => {
    const { root, branches } = buildTree(1);
    const image = { naturalWidth: 8, naturalHeight: 8 } as HTMLImageElement;

    expect(readAverages(image, root, branches, 0)).toBe(false);
  });

  it("正常采样后回填平均色并返回 true", () => {
    const { root, branches } = buildTree(1);
    const image = { naturalWidth: 8, naturalHeight: 8 } as HTMLImageElement;
    const drawImage = vi.fn();
    const data = new Uint8ClampedArray(128 * 128 * 4);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 3] = 255;
    }

    HTMLCanvasElement.prototype.getContext = (() => ({
      drawImage,
      getImageData: () => ({ data }),
    })) as never;

    try {
      expect(readAverages(image, root, branches, 0)).toBe(true);
      expect(drawImage).toHaveBeenCalledTimes(1);
      expect(root.r).toBe(255);
      expect(root.g).toBe(0);
    } finally {
      HTMLCanvasElement.prototype.getContext = (() => null) as never;
    }
  });
});

describe("createScene", () => {
  it("初始场景为零宽高、无图、无颜色", () => {
    const scene = createScene(asCtx(stubCtx()), buildTree(1).root);

    expect(scene.width).toBe(0);
    expect(scene.height).toBe(0);
    expect(scene.image).toBeNull();
    expect(scene.hasColors).toBe(false);
    expect(scene.split).toBe(0);
    expect(scene.fade).toBe(0);
  });
});

describe("常量导出（组件时序依赖）", () => {
  it("COLOR_MS / WAIT_CAP 与既有动画时序一致", () => {
    expect(COLOR_MS).toBe(420);
    expect(WAIT_CAP).toBe(0.72);
  });
});
