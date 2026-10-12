import { DOMParser } from "@xmldom/xmldom";
import { describe, expect, it } from "vitest";

import { generateRandomImageSvg } from "@/lib/server/random-image-art";

/** 解析 SVG 文本，返回文档根元素；非法 XML 会抛错（Element 取 xmldom 的类型推断） */
function parse(svg: string) {
  const root = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;

  if (!root) {
    throw new Error("invalid svg document");
  }

  return root;
}

describe("generateRandomImageSvg 确定性", () => {
  it("同 seed 同尺寸输出逐字节一致", () => {
    const a = generateRandomImageSvg("abc123", 128, 128);
    const b = generateRandomImageSvg("abc123", 128, 128);

    expect(a).toBe(b);
  });

  it("seed 不同输出不同", () => {
    const a = generateRandomImageSvg("seed-a", 128, 128);
    const b = generateRandomImageSvg("seed-b", 128, 128);

    expect(a).not.toBe(b);
  });

  it("尺寸不同输出不同（同一 seed 在不同画布下构图随尺寸变化）", () => {
    const a = generateRandomImageSvg("same-seed", 128, 128);
    const b = generateRandomImageSvg("same-seed", 256, 128);

    expect(a).not.toBe(b);
  });
});

describe("generateRandomImageSvg 产物合法性", () => {
  it("是可解析的 XML，根元素为 svg", () => {
    const svg = generateRandomImageSvg("xml-check", 128, 128);
    const root = parse(svg);

    expect(root.tagName).toBe("svg");
  });

  it("带请求的 width/height 属性（GridReveal 依赖 naturalWidth）", () => {
    const root = parse(generateRandomImageSvg("dims", 320, 240));

    expect(root.getAttribute("width")).toBe("320");
    expect(root.getAttribute("height")).toBe("240");
  });

  it("包含渐变定义与可见形状，且为纯 ASCII（data URI base64 安全）", () => {
    const svg = generateRandomImageSvg("content", 128, 128);

    expect(svg).toContain("<defs>");
    expect(svg).toContain("linearGradient");
    // 光斑（3~4）+ 点缀形状（3~6）至少共 6 个可见元素
    expect((svg.match(/<(circle|rect|path)\b/g) || []).length).toBeGreaterThanOrEqual(
      6,
    );
    expect(/^[\x20-\x7e]*$/.test(svg)).toBe(true);
  });
});
