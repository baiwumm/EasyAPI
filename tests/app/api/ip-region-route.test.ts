import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "@/app/api/ip-region/route";

const EXPLICIT_IP_CACHE =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const AUTO_IP_CACHE = "private, no-store";

/** 伪造第三方响应：body 是字符串，绕过 Response 的 JSON 解析以便构造非 JSON 场景 */
function fakeResponse(body: string, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => {
      try {
        return JSON.parse(body);
      } catch {
        throw new SyntaxError(`Unexpected token in JSON: ${body.slice(0, 20)}`);
      }
    },
    text: async () => body,
  } as Response;
}

function req(query = "", headers: Record<string, string> = {}) {
  return new NextRequest(`http://x/api/ip-region${query}`, { headers });
}

async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: Record<string, unknown> | null;
    timestamp: number;
  };
}

describe("GET /api/ip-region", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("显式传 IP 时返回归属地数据，并带可公共缓存的长 Cache-Control", async () => {
    fetchSpy.mockResolvedValueOnce(
      fakeResponse(JSON.stringify({ country: "中国", query: "1.1.1.1" })),
    );

    const res = await GET(req("?ip=1.1.1.1"));
    const b = await body(res);

    expect(b.code).toBe(200);
    expect(b.data).toMatchObject({ country: "中国", query: "1.1.1.1" });
    expect(res.headers.get("Cache-Control")).toBe(EXPLICIT_IP_CACHE);
    // 只打了第三方一次，没有多余的出口 IP 探测
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toContain("http://ip-api.com/json/1.1.1.1");
  });

  it("未传 IP 时取转发头里的客户端 IP，且不进公共缓存", async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse(JSON.stringify({ query: "8.8.8.8" })));

    const res = await GET(req("", { "x-forwarded-for": "8.8.8.8, 10.0.0.1" }));

    expect((await body(res)).data).toMatchObject({ query: "8.8.8.8" });
    expect(res.headers.get("Cache-Control")).toBe(AUTO_IP_CACHE);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  // C12：第三方返回 HTML/空 body 时，以前会把 "Unexpected token" 原文透出去
  it("第三方返回非 JSON 时兜底固定文案，不透出解析原文", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchSpy.mockResolvedValueOnce(
      fakeResponse("<html>Rate limit exceeded</html>"),
    );

    const b = await body(await GET(req("?ip=1.1.1.1")));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("归属地数据解析失败");
    expect(JSON.stringify(b)).not.toContain("Unexpected token");
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("Unexpected token"),
    );
    errorSpy.mockRestore();
  });

  it("第三方 HTTP 非 2xx 时返回带状态码的提示", async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse("", false, 503));

    const b = await body(await GET(req("?ip=1.1.1.1")));

    expect(b.code).toBe(500);
    expect(b.msg).toContain("503");
  });

  it("IP 格式非法时直接拒绝，不打第三方", async () => {
    const b = await body(await GET(req("?ip=1.2.3.4/../admin")));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("IP 地址格式不正确");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("回环地址且拿不到真实出口 IP 时先探测出口 IP 再查归属地", async () => {
    fetchSpy
      .mockResolvedValueOnce(fakeResponse("203.0.113.7\n"))
      .mockResolvedValueOnce(fakeResponse(JSON.stringify({ query: "203.0.113.7" })));

    const res = await GET(req("", { "x-forwarded-for": "127.0.0.1" }));

    expect((await body(res)).data).toMatchObject({ query: "203.0.113.7" });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    // 自动探测出的 IP 同样不能进公共缓存
    expect(res.headers.get("Cache-Control")).toBe(AUTO_IP_CACHE);
  });

  it("出口 IP 探测失败时返回固定文案", async () => {
    fetchSpy.mockResolvedValueOnce(fakeResponse("", false, 502));

    const b = await body(await GET(req("", { "x-forwarded-for": "127.0.0.1" })));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("获取出口 IP 失败");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
