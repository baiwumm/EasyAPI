/*
 * @Description: 随机图片的确定性生成艺术 SVG（G8：替代第三方 loremflickr 图源）
 *
 * 背景见 backlog G8：原实现走 faker.image.url() 指向第三方 loremflickr，
 * 第三方不可用则整页图片全废。改为服务端本地生成抽象风格矢量图：
 * - 确定性：同 seed 同尺寸输出逐字节一致，便于测试与缓存语义
 * - 零外部依赖：纯数学 + 字符串拼接，无图片库调用，Serverless 友好
 * - 矢量：SVG 带 width/height 属性，任何尺寸下体积恒定（约 2~4KB）
 */

/** FNV-1a：把 seed 字符串散列成 32 位无符号整数，作为 PRNG 种子 */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;

  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

/**
 * mulberry32：轻量确定性 PRNG。
 * 同一整数种子永远产生同一序列，是「同 seed 同图」的根基
 */
function createRandom(seed: number): () => number {
  let state = seed | 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Random = () => number;

/** [min, max) 区间取浮点 */
const between = (rand: Random, min: number, max: number): number =>
  min + rand() * (max - min);

/** [min, max] 区间取整数 */
const betweenInt = (rand: Random, min: number, max: number): number =>
  Math.floor(between(rand, min, max + 1));

/** 数组随机取一 */
const pick = <T>(rand: Random, items: readonly T[]): T =>
  items[Math.floor(rand() * items.length)];

/** 一位小数，控制产物体积 */
const round1 = (value: number): number => Math.round(value * 10) / 10;

const hsl = (hue: number, sat: number, light: number): string =>
  `hsl(${Math.round(hue)},${Math.round(sat)}%,${Math.round(light)}%)`;

/**
 * 构造一组协调的颜色：主色 + 两个限定间隔的邻近/对比色相，
 * 避免纯随机色相出现脏色组合
 */
function createPalette(rand: Random) {
  const baseHue = between(rand, 0, 360);
  const neighbor = baseHue + between(rand, 25, 60);
  const contrast = baseHue + between(rand, 150, 210);

  return {
    /** 背景渐变两端 */
    from: hsl(baseHue, between(rand, 55, 80), between(rand, 40, 58)),
    to: hsl(neighbor, between(rand, 55, 80), between(rand, 22, 38)),
    /** 光斑与形状 */
    accents: [hsl(neighbor, 75, 62), hsl(contrast, 70, 60), hsl(baseHue, 85, 72)],
    /** 高光（浅色形状/描边） */
    highlight: hsl(baseHue, 30, between(rand, 88, 96)),
  };
}

/** 一个径向渐变光斑（中心有色、边缘透明），营造景深 */
function glowDef(rand: Random, index: number, color: string): string {
  return (
    `<radialGradient id="g${index}">` +
    `<stop offset="0" stop-color="${color}" stop-opacity="${round1(between(rand, 0.35, 0.6))}"/>` +
    `<stop offset="1" stop-color="${color}" stop-opacity="0"/>` +
    `</radialGradient>`
  );
}

/** 画布上的一个大光斑 */
function glowShape(
  rand: Random,
  index: number,
  width: number,
  height: number,
): string {
  const radius = between(rand, 0.3, 0.7) * Math.max(width, height);

  return (
    `<circle cx="${round1(between(rand, 0, width))}"` +
    ` cy="${round1(between(rand, 0, height))}"` +
    ` r="${round1(radius)}" fill="url(#g${index})"/>`
  );
}

/** 几何点缀形状：描边圆 / 实心圆 / 圆角矩形 / 三角形，随机取一 */
function accentShape(
  rand: Random,
  width: number,
  height: number,
  color: string,
): string {
  const cx = round1(between(rand, 0, width));
  const cy = round1(between(rand, 0, height));
  const size = between(rand, 0.06, 0.2) * Math.max(width, height);
  const opacity = round1(between(rand, 0.2, 0.5));
  const rotate = round1(between(rand, 0, 360));

  switch (pick(rand, ["ring", "dot", "rect", "triangle"] as const)) {
    case "ring":
      return (
        `<circle cx="${cx}" cy="${cy}" r="${round1(size)}"` +
        ` fill="none" stroke="${color}" stroke-opacity="${opacity}"` +
        ` stroke-width="${round1(Math.max(1, size / 12))}"/>`
      );
    case "dot":
      return (
        `<circle cx="${cx}" cy="${cy}" r="${round1(size / 2)}"` +
        ` fill="${color}" fill-opacity="${opacity}"/>`
      );
    case "rect":
      return (
        `<rect x="${round1(cx - size / 2)}" y="${round1(cy - size / 2)}"` +
        ` width="${round1(size)}" height="${round1(size)}"` +
        ` rx="${round1(size / 6)}" fill="${color}" fill-opacity="${opacity}"` +
        ` transform="rotate(${rotate} ${cx} ${cy})"/>`
      );
    default:
      return (
        `<path d="M${cx} ${round1(cy - size / 2)}` +
        ` L${round1(cx + size / 2)} ${round1(cy + size / 2)}` +
        ` L${round1(cx - size / 2)} ${round1(cy + size / 2)} Z"` +
        ` fill="${color}" fill-opacity="${opacity}"` +
        ` transform="rotate(${rotate} ${cx} ${cy})"/>`
      );
  }
}

/**
 * @description: 生成确定性抽象风格图片 SVG
 * 同一 (seed, width, height) 输出逐字节一致；不同 seed 完全不同
 */
export function generateRandomImageSvg(
  seed: string,
  width: number,
  height: number,
): string {
  const rand = createRandom(hashSeed(seed));
  const palette = createPalette(rand);

  const glowColors = [...palette.accents].sort(() => rand() - 0.5);
  const glowCount = betweenInt(rand, 3, 4);
  const accentCount = betweenInt(rand, 3, 6);

  const defs: string[] = [
    `<linearGradient id="bg" x1="${round1(between(rand, 0, 1))}" y1="0" x2="${round1(between(rand, 0, 1))}" y2="1">` +
      `<stop offset="0" stop-color="${palette.from}"/>` +
      `<stop offset="1" stop-color="${palette.to}"/>` +
      `</linearGradient>`,
    // 暗角：四周压暗，增加层次感
    `<radialGradient id="vig" cx="0.5" cy="0.45" r="0.75">` +
      `<stop offset="0.6" stop-color="#000" stop-opacity="0"/>` +
      `<stop offset="1" stop-color="#000" stop-opacity="0.28"/>` +
      `</radialGradient>`,
    ...glowColors
      .slice(0, glowCount)
      .map((color, index) => glowDef(rand, index, color)),
  ];

  const shapes: string[] = [
    glowColors
      .slice(0, glowCount)
      .map((_, index) => glowShape(rand, index, width, height)),
    Array.from({ length: accentCount }, () =>
      // 高光形状与彩色形状穿插
      accentShape(rand, width, height, pick(rand, [...palette.accents, palette.highlight])),
    ),
  ].flat();

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"` +
    ` viewBox="0 0 ${width} ${height}">` +
    `<defs>${defs.join("")}</defs>` +
    `<rect width="${width}" height="${height}" fill="url(#bg)"/>` +
    shapes.join("") +
    `<rect width="${width}" height="${height}" fill="url(#vig)"/>` +
    `</svg>`
  );
}
