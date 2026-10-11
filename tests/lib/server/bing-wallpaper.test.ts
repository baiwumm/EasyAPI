import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// 模块内有 24h 模块级缓存 + inflight 去重，跨用例会串状态，
// 所以每个用例都 resetModules 后动态 import，拿到干净的模块实例。
// load() 返回函数本身，需要多次调用的用例就拿住同一实例。

const goodPayload = {
  images: [
    {
      url: "/th?id=OHR.Test_ZH-CN123456&rf=LaDigue_1920x1080.jpg",
      title: "测试标题",
      copyright: "测试版权",
    },
  ],
};

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

describe("getBingWallpaper", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const load = async () =>
    (await import("@/lib/server/bing-wallpaper")).getBingWallpaper;

  it("正常把相对路径补成 bing.com 绝对地址，并透传标题版权", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse(goodPayload));

    expect(await (await load())()).toEqual({
      url: "https://bing.com/th?id=OHR.Test_ZH-CN123456&rf=LaDigue_1920x1080.jpg",
      title: "测试标题",
      copyright: "测试版权",
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  // C9：Bing 改返回结构时这里必须直接失败，而不是把坏 url 当好东西缓存，
  // 让下游（JSX、/api/bing-wallpaper）无防护地 new URL() 后把 ISR 页缓存成错误页
  it("img.url 为空导致缺 id 时抛错，不写入缓存", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse({ images: [{ url: "" }] }));

    await expect((await load())()).rejects.toThrow(/缺少 id/);

    // 失败后没被写进缓存：换个正常响应能立刻拿到，而不是拿到坏数据
    fetchSpy.mockResolvedValueOnce(jsonResponse(goodPayload));
    expect((await (await load())()).url).toContain("OHR.Test_ZH-CN123456");
  });

  it("地址不可解析时抛错，不写入缓存", async () => {
    fetchSpy.mockResolvedValueOnce(
      jsonResponse({ images: [{ url: "not a url" }] }),
    );

    await expect((await load())()).rejects.toThrow(/无法解析/);
  });

  it("images 为空时抛「未获取到壁纸数据」", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse({ images: [] }));

    await expect((await load())()).rejects.toThrow("未获取到壁纸数据");
  });

  it("HTTP 非 2xx 时抛错且带上状态码", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse({}, false, 503));

    await expect((await load())()).rejects.toThrow("HTTP 503");
  });

  it("第二个请求直接命中缓存，不再 fetch", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse(goodPayload));
    const getBingWallpaper = await load();

    await getBingWallpaper();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("并发调用共享同一次 fetch（inflight 去重）", async () => {
    fetchSpy.mockResolvedValueOnce(jsonResponse(goodPayload));
    const getBingWallpaper = await load();

    const [a, b] = await Promise.all([getBingWallpaper(), getBingWallpaper()]);
    expect(a).toEqual(b);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("缓存过期后刷新失败时兜底返回旧缓存", async () => {
    vi.useFakeTimers();
    try {
      fetchSpy.mockResolvedValueOnce(jsonResponse(goodPayload));
      const getBingWallpaper = await load();
      const first = await getBingWallpaper();

      vi.advanceTimersByTime(25 * 60 * 60 * 1000);
      fetchSpy.mockRejectedValueOnce(new Error("network down"));

      expect(await getBingWallpaper()).toEqual(first);
    } finally {
      vi.useRealTimers();
    }
  });
});
