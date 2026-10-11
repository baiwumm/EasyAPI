import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// 记录 dicebear 被调了几次：缓存生效时第二次请求不应该再生成一次
const { svgCalls } = vi.hoisted(() => ({ svgCalls: { count: 0 } }));

vi.mock("@dicebear/core", () => ({
  createAvatar: (style: unknown, options: unknown) => {
    svgCalls.count += 1;

    return {
      toString: () => `<svg data-options="${JSON.stringify(options)}" />`,
    };
  },
}));

import { GET } from "@/app/api/random-avatar/route";

const req = (query: string) =>
  new NextRequest(`http://x/api/random-avatar${query}`);

// 缓存是模块级的、跨用例复用，所以每个用例用不同 seed，互不干扰
describe("GET /api/random-avatar SVG 缓存", () => {
  beforeEach(() => {
    svgCalls.count = 0;
  });

  it("返回 svg 与长 Cache-Control", async () => {
    const res = await GET(req("?seed=base"));

    expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=31536000");
  });

  it("同样的 seed+style+size 命中缓存，不再重复生成 SVG", async () => {
    await GET(req("?seed=hit-1&style=bottts&size=128"));

    expect(svgCalls.count).toBe(1);

    await GET(req("?seed=hit-1&style=bottts&size=128"));

    expect(svgCalls.count).toBe(1);
  });

  it("seed 不同时各自生成，互不串味", async () => {
    await GET(req("?seed=seed-a"));
    await GET(req("?seed=seed-b"));

    expect(svgCalls.count).toBe(2);
  });

  it("style 不同时各自生成（同一 seed 在不同风格下头像不同）", async () => {
    await GET(req("?seed=style-1&style=bottts"));
    await GET(req("?seed=style-1&style=micah"));

    expect(svgCalls.count).toBe(2);
  });

  it("size 不同时各自生成", async () => {
    await GET(req("?seed=size-1&size=128"));
    await GET(req("?seed=size-1&size=256"));

    expect(svgCalls.count).toBe(2);
  });

  it("返回体就是生成的 SVG", async () => {
    const res = await GET(req("?seed=echo&style=bottts&size=64"));

    expect(await res.text()).toBe(
      '<svg data-options="{"seed":"echo","size":64}" />',
    );
  });
});
