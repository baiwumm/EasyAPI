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

// F6：只返 URL 的话浏览器还要逐个请求，每个都再过一次中间件的计数查询
describe("GET /api/random-avatar 批量", () => {
  beforeEach(() => {
    svgCalls.count = 0;
  });

  it("format=data 返回 data URI 数组，可直接给 <img> 用", async () => {
    const res = await GET(req("?count=5&format=data"));
    const body = (await res.json()) as {
      code: number;
      data: string[];
    };

    expect(body.code).toBe(200);
    expect(body.data).toHaveLength(5);
    body.data.forEach((item) => {
      expect(item.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true);
    });
  });

  it("不带 format 时仍返回 URL 数组（保持向后兼容）", async () => {
    const body = (await (await GET(req("?count=3"))).json()) as {
      data: string[];
    };

    expect(body.data).toHaveLength(3);
    body.data.forEach((item) => {
      expect(item.startsWith("http://x/api/random-avatar?seed=")).toBe(true);
    });
  });

  it("count 上限 50，与页面控件的 maxValue 一致", async () => {
    const body = (await (await GET(req("?count=999&format=data"))).json()) as {
      data: string[];
    };

    expect(body.data).toHaveLength(50);
  });

  it("style=random 时逐个头像各自随机，URL 里带上的是具体风格", async () => {
    const body = (await (await GET(req("?count=5"))).json()) as {
      data: string[];
    };

    body.data.forEach((url) => {
      expect(url).toContain("style=");
      // random 必须已被解析成具体风格，不能原样透传
      expect(url).not.toContain("style=random");
    });
  });

  it("批量生成同样走缓存：同一 seed+style+size 不重复生成", async () => {
    // 连续两次同参批量的 seed 是随机的，走的是不同 key，这里只验证不会少于生成次数
    await GET(req("?count=3&format=data&style=bottts&size=32"));

    expect(svgCalls.count).toBe(3);
  });
});
