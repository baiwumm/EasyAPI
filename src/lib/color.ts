import { parseColor } from "@heroui/react";
import tinycolor from "tinycolor2";

/** 取色器预设色板（color-conversion / tailwind-color-palette 共用） */
export const colorPresets = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
] as const;

/** 随机取色并解析为 HeroUI 颜色对象 */
export function getRandomColor() {
  return parseColor(tinycolor.random().toHexString());
}
