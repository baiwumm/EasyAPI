import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { upstreamFetch } = vi.hoisted(() => ({ upstreamFetch: vi.fn() }));

import { GET } from "@/app/api/avatar-proxy/route";

const req = (query: string) =>
  new NextRequest(`http://x/api/avatar-proxy${query}`);

/** PNG 魔数前缀，验证二进制透传用 */
const IMAGE_BYTES = new Uint8Array([137, 80, 78, 71]);

beforeEach(() => {
  upstreamFetch.mockReset();
  vi.stubGlobal("fetch", upstreamFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/avatar-proxy", () => {
  it("缺少 url 参数时拒绝，且不发起上游请求", async () => {
    const res = await GET(req(""));
    const body = await res.json();

    expect(body.code).toBe(500);
    expect(body.msg).toContain("仅支持");
    expect(upstreamFetch).not.toHaveBeenCalled();
  });

  it.each([
    "http://avatars.githubusercontent.com/u/1.png", // 非 https
    "https://evil.com/a.png", // 其他域名
    "https://avatars.githubusercontent.com.evil.com/a.png", // 仿冒后缀域名
    "https://github.com/u/1.png", // GitHub 主站（非头像域名）
  ])("非白名单地址 %s 拒绝代理（SSRF 防护）", async (target) => {
    const res = await GET(req(`?url=${encodeURIComponent(target)}`));
    const body = await res.json();

    expect(body.code).toBe(500);
    expect(upstreamFetch).not.toHaveBeenCalled();
  });

  it("白名单头像透传内容与类型，并带浏览器长缓存", async () => {
    upstreamFetch.mockResolvedValue(
      new Response(IMAGE_BYTES, {
        status: 200,
        headers: { "content-type": "image/png" },
      }),
    );

    const target = "https://avatars.githubusercontent.com/u/405545717?v=4";
    const res = await GET(req(`?url=${encodeURIComponent(target)}`));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(res.headers.get("Cache-Control")).toContain("max-age=86400");
    expect([...new Uint8Array(await res.arrayBuffer())]).toEqual([
      ...IMAGE_BYTES,
    ]);
    expect(upstreamFetch).toHaveBeenCalledWith(target, expect.anything());
  });

  it("上游非 200 或非图片内容时不透传", async () => {
    upstreamFetch
      .mockResolvedValueOnce(new Response("nope", { status: 404 }))
      .mockResolvedValueOnce(
        new Response("<html></html>", {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
      );

    const target = "https://avatars.githubusercontent.com/u/1?v=1";
    const notFound = await GET(req(`?url=${encodeURIComponent(target)}`));
    expect((await notFound.json()).code).toBe(500);

    const notImage = await GET(req(`?url=${encodeURIComponent(target)}`));
    expect((await notImage.json()).code).toBe(500);
  });

  it("上游网络异常返回错误 envelope，不裸抛", async () => {
    upstreamFetch.mockRejectedValue(new TypeError("fetch failed"));

    const res = await GET(
      req(
        `?url=${encodeURIComponent("https://avatars.githubusercontent.com/u/1?v=1")}`,
      ),
    );

    expect((await res.json()).code).toBe(500);
  });
});
