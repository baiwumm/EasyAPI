/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-18 16:57:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-18 17:12:03
 * @Description: 随机颜色
 */

import { formatSuccess, formatFail } from "~/lib/constant";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };
type HSV = { h: number; s: number; v: number };

type ColorFull = {
  hex: string;
  rgb: RGB & { string: string };
  hsl: HSL & { string: string };
  hsv: HSV & { string: string };
};

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function padHex(n: number) {
  return n.toString(16).padStart(2, '0');
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${padHex(Math.round(r))}${padHex(Math.round(g))}${padHex(Math.round(b))}`.toUpperCase();
}

// Convert HSL to RGB (all values: h in [0,360), s/l in [0,100])
function hslToRgb({ h, s, l }: HSL): RGB {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (hh >= 0 && hh < 1) [r1, g1, b1] = [c, x, 0];
  else if (hh >= 1 && hh < 2) [r1, g1, b1] = [x, c, 0];
  else if (hh >= 2 && hh < 3) [r1, g1, b1] = [0, c, x];
  else if (hh >= 3 && hh < 4) [r1, g1, b1] = [0, x, c];
  else if (hh >= 4 && hh < 5) [r1, g1, b1] = [x, 0, c];
  else[r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

// Convert RGB to HSV (r/g/b in [0,255])
function rgbToHsv({ r, g, b }: RGB): HSV {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === rr) h = ((gg - bb) / d) % 6;
  else if (max === gg) h = (bb - rr) / d + 2;
  else h = (rr - gg) / d + 4;
  h = Math.round(((h * 60) + 360) % 360);
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s: +(s * 100).toFixed(1), v: +(v * 100).toFixed(1) };
}

function rgbString(rgb: RGB) {
  return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
}

function hslString(hsl: HSL) {
  return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}

function hsvString(hsv: HSV) {
  return `hsv(${Math.round(hsv.h)}, ${hsv.s}%, ${hsv.v}%)`;
}

// Generate a single pleasing random color using random HSL (avoid extremes)
function generateRandomHsl(): HSL {
  const h = Math.floor(Math.random() * 360);
  // keep saturation and lightness in reasonable ranges to avoid too pale or too dark
  const s = Math.floor(40 + Math.random() * 50); // 40% - 90%
  const l = Math.floor(30 + Math.random() * 40); // 30% - 70%
  return { h, s, l };
}

function buildColor(): ColorFull {
  const hsl = generateRandomHsl();
  const rgb = hslToRgb(hsl);
  const hsv = rgbToHsv(rgb);
  const hex = rgbToHex(rgb);
  return {
    hex,
    rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), string: rgbString(rgb) },
    hsl: { ...hsl, string: hslString(hsl) },
    hsv: { ...hsv, string: hsvString(hsv) },
  };
}

// 支持查询参数:
//  - count (number): 要生成颜色的数量，1-50，默认 1
//  - format (string): 返回格式，可选值: hex | rgb | hsl | hsv | all（默认）
// 示例: GET /api/random-color?count=3&format=all
export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event) as Record<string, string | undefined>;
    const count = clamp(Number(q.count ?? 1), 1, 50);
    const fmt = (q.format ?? 'all').toLowerCase();

    // generate
    const colors: ColorFull[] = [];
    for (let i = 0; i < Math.round(count); i++) {
      colors.push(buildColor());
    }

    // map result according to format
    let result: unknown;
    if (fmt === 'hex') result = colors.map((c) => c.hex);
    else if (fmt === 'rgb') result = colors.map((c) => ({ ...c.rgb }));
    else if (fmt === 'hsl') result = colors.map((c) => ({ ...c.hsl }));
    else if (fmt === 'hsv') result = colors.map((c) => ({ ...c.hsv }));
    else result = colors; // all

    return formatSuccess(result);
  } catch (error) {
    return formatFail((error as Error)?.message || '获取随机颜色失败')
  }
});