/*
 * @Description: Bing 每日壁纸（模块级缓存，一天内数据不变）
 */
interface BingWallpaper {
  url: string;
  title: string;
  copyright: string;
}

// 每日壁纸 TTL：24 小时
const CACHE_TTL = 24 * 60 * 60 * 1000;
let cached: BingWallpaper | null = null;
let cachedAt = 0;
// 进行中的请求去重：缓存未命中时多个并发调用共享同一个 fetch
let inflight: Promise<BingWallpaper> | null = null;

/**
 * @description: 获取 Bing 每日壁纸，带模块级缓存（跨请求复用，避免重复 fetch）
 */
export function getBingWallpaper(): Promise<BingWallpaper> {
  const now = Date.now();

  // 命中缓存直接返回
  if (cached && now - cachedAt < CACHE_TTL) {
    return Promise.resolve(cached);
  }

  // 已有进行中的请求则复用，避免并发重复请求 Bing
  if (!inflight) {
    inflight = fetchBingWallpaper()
      .catch((err) => {
        // 刷新失败时兜底返回旧缓存，并刷新缓存时间，避免后续请求反复击穿
        if (cached) {
          cachedAt = Date.now();

          return cached;
        }
        throw err;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

async function fetchBingWallpaper(): Promise<BingWallpaper> {
  const response = await fetch(
    "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN",
    { signal: AbortSignal.timeout(5000) },
  );

  if (!response.ok) {
    throw new Error(`bing 每日壁纸 接口出错：HTTP ${response.status}`);
  }

  const responseBody = await response.json();
  const img = responseBody.images?.[0];

  if (!img) {
    throw new Error("未获取到壁纸数据");
  }

  cached = {
    url: `https://bing.com${img.url}`,
    title: img.title,
    copyright: img.copyright,
  };
  cachedAt = Date.now();

  return cached;
}
