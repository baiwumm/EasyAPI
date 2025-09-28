/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-28 16:05:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-28 16:34:23
 * @Description: 颜色转换
 */
import { formatSuccess, formatFail } from "~/lib/constant";

// RGB 转 HEX
function rgbToHex(r: number, g: number, b: number): string {
  const padHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${padHex(r)}${padHex(g)}${padHex(b)}`.toUpperCase();
}

// HSL 转 RGB
function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;

  if (hh >= 0 && hh < 1) [r1, g1, b1] = [c, x, 0];
  else if (hh >= 1 && hh < 2) [r1, g1, b1] = [x, c, 0];
  else if (hh >= 2 && hh < 3) [r1, g1, b1] = [0, c, x];
  else if (hh >= 3 && hh < 4) [r1, g1, b1] = [0, x, c];
  else if (hh >= 4 && hh < 5) [r1, g1, b1] = [x, 0, c];
  else[r1, g1, b1] = [c, 0, x];

  const m = l - c / 2;
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
}

// HSV 转 RGB
function hsvToRgb(h: number, s: number, v: number): { r: number, g: number, b: number } {
  s /= 100;
  v /= 100;
  let r1 = 0, g1 = 0, b1 = 0;

  if (s === 0) {
    // 处理纯黑色 (value = 0)
    r1 = g1 = b1 = v * 255;
  } else {
    const c = v * s;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));

    if (hh >= 0 && hh < 1) [r1, g1, b1] = [c, x, 0];
    else if (hh >= 1 && hh < 2) [r1, g1, b1] = [x, c, 0];
    else if (hh >= 2 && hh < 3) [r1, g1, b1] = [0, c, x];
    else if (hh >= 3 && hh < 4) [r1, g1, b1] = [0, x, c];
    else if (hh >= 4 && hh < 5) [r1, g1, b1] = [x, 0, c];
    else[r1, g1, b1] = [c, 0, x];

    const m = v - c;
    r1 = Math.round((r1 + m) * 255);
    g1 = Math.round((g1 + m) * 255);
    b1 = Math.round((b1 + m) * 255);
  }

  return { r: r1, g: g1, b: b1 };
}

// 校正后的返回值（确保为 0% 的时候正确显示）
function rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : (delta / max) * 100; // 处理无色（灰色或黑色）情况
  let v = max * 100;

  if (delta !== 0) {
    if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h *= 60;
  }

  return { h, s, v };
}

// RGB 转 HSL
function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0, s = 0, l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

// 校验输入颜色格式
function validateColorFormat(color: string) {
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  const rgbPattern = /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/;
  const hslPattern = /^hsl\(\s*(\d{1,3}),\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/;
  const hsvPattern = /^hsv\(\s*(\d{1,3}),\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/;

  if (hexPattern.test(color)) return 'hex';
  if (rgbPattern.test(color)) return 'rgb';
  if (hslPattern.test(color)) return 'hsl';
  if (hsvPattern.test(color)) return 'hsv';
  return null;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const color = query.color as string;

    if (!color) {
      return formatFail('color 参数是必填的')
    }

    const format = validateColorFormat(color);

    if (!format) {
      return formatFail('无效的颜色格式')
    }

    // 根据不同的格式进行转换
    let r = 0, g = 0, b = 0, h = 0, s = 0, l = 0, v = 0;

    if (format === 'hex') {
      // 解析 HEX 转 RGB
      const hex = color.slice(1);
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (format === 'rgb') {
      const match = color.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
      [r, g, b] = match!.slice(1, 4).map(Number);
    } else if (format === 'hsl') {
      const match = color.match(/^hsl\((\d{1,3}),\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\)$/);
      [h, s, l] = match!.slice(1, 4).map(Number);
      const rgb = hslToRgb(h, s, l);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    } else if (format === 'hsv') {
      const match = color.match(/^hsv\((\d{1,3}),\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\)$/);
      [h, s, v] = match!.slice(1, 4).map(Number);
      const rgb = hsvToRgb(h, s, v);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    }

    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    const hsv = rgbToHsv(r, g, b);

    // 格式化 hsv 和 hsl
    const formattedHsl = `hsl(${hsl.h.toFixed(2)}, ${hsl.s.toFixed(1)}%, ${hsl.l.toFixed(1)}%)`;
    const formattedHsv = `hsv(${hsv.h.toFixed(0)}, ${hsv.s.toFixed(0)}%, ${hsv.v.toFixed(0)}%)`;

    return formatSuccess({
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: formattedHsl,
      hsv: formattedHsv,
    })
  } catch (error) {
    return formatFail((error as Error)?.message || '颜色转换失败')
  }
});
