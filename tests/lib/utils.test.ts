import { describe, expect, it } from "vitest";

import { parseBoundedInt } from "@/lib/utils";

describe("parseBoundedInt", () => {
  it("按边界钳制数值", () => {
    expect(parseBoundedInt("5", 1, 1, 100)).toBe(5);
    expect(parseBoundedInt("0", 1, 1, 100)).toBe(1);
    expect(parseBoundedInt("200", 1, 1, 100)).toBe(100);
  });

  // B1/B2 的回归点：此前用 parseInt + Math.max/Math.min，
  // 非数字会得到 NaN 并一路透传给下游库
  it("非数字与空值回退到 fallback，而不是产出 NaN", () => {
    expect(parseBoundedInt("abc", 16, 1, 100)).toBe(16);
    expect(parseBoundedInt("", 16, 1, 100)).toBe(16);
    expect(parseBoundedInt(null, 16, 1, 100)).toBe(16);
    expect(parseBoundedInt("12abc", 16, 1, 100)).toBe(12);
  });

  it("负数、小数与 parse 截断行为", () => {
    expect(parseBoundedInt("-5", 3, 1, 100)).toBe(1);
    expect(parseBoundedInt("3.7", 1, 1, 100)).toBe(3);
    // parseInt 遇到非数字字符即截断：parseInt("1e3") === 1
    // 这是可接受的——不会产生 NaN，最坏情况是取到比预期小的值后被 min 兜住
    expect(parseBoundedInt("1e3", 1, 1, 100)).toBe(1);
    // 带空白与前后缀也走同一截断路径
    expect(parseBoundedInt(" 42 ", 1, 1, 100)).toBe(42);
    expect(parseBoundedInt("64px", 1, 1, 100)).toBe(64);
  });
});
