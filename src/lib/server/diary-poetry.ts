/*
 * @Description: 今日诗词（模块级缓存：页面语义为"每日"，一天内复用同一首，
 * 避免每个请求都打第三方；并发去重 + 失败回退旧缓存，模式与 bing-wallpaper 一致）
 */

interface PoetryItem {
  content: string;
  origin: string;
  author: string;
  category: string;
}

// 缓存 TTL：24 小时
const CACHE_TTL = 24 * 60 * 60 * 1000;
let cached: PoetryItem | null = null;
let cachedAt = 0;
// 进行中的请求去重：缓存未命中时多个并发调用共享同一个 fetch
let inflight: Promise<PoetryItem> | null = null;

export function getDiaryPoetry(): Promise<PoetryItem> {
  const now = Date.now();

  // 命中缓存直接返回
  if (cached && now - cachedAt < CACHE_TTL) {
    return Promise.resolve(cached);
  }

  // 已有进行中的请求则复用，避免并发重复请求第三方
  if (!inflight) {
    inflight = fetchDiaryPoetry()
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

async function fetchDiaryPoetry(): Promise<PoetryItem> {
  const response = await fetch("https://v1.jinrishici.com/all.json", {
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`今日诗词 接口出错：HTTP ${response.status}`);
  }

  const responseBody = await response.json();

  if (!responseBody?.content) {
    throw new Error("今日诗词 未返回内容");
  }

  cached = responseBody;
  cachedAt = Date.now();

  return cached;
}
