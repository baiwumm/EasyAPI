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

  const url = `https://bing.com${img.url}`;

  // 返回前校验地址可解析且带 id：Bing 改返回结构时在这里就失败，
  // 走缓存兜底，而不是把坏数据写进缓存让下游（JSX、接口）无防护地拼接（C9）
  assertWallpaperUrl(url);

  cached = {
    url,
    title: img.title,
    copyright: img.copyright,
  };
  cachedAt = Date.now();

  return cached;
}

/**
 * @description: 校验壁纸地址可被解析且带 id，不可解析时抛出明确错误
 */
function assertWallpaperUrl(url: string): void {
  let id: string | null = null;

  try {
    id = new URL(url).searchParams.get("id");
  } catch {
    throw new Error(`bing 壁纸地址无法解析：${url}`);
  }

  if (!id) {
    throw new Error(`bing 壁纸地址缺少 id：${url}`);
  }
}
