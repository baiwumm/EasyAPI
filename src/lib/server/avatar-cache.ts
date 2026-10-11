/*
 * @Description: 随机头像 SVG 的内存 LRU 缓存
 */

/**
 * 缓存条目上限。单条 SVG 约 1~3KB，200 条大约几百 KB，
 * 足够覆盖同一次批量生成（最多 20 个）的重复请求，又不会把内存吃满
 */
const MAX_ENTRIES = 200;

/** 测试专用：暴露上限，避免用例里把几千条数据写进测试 */
export const MAX_ENTRIES_FOR_TEST = MAX_ENTRIES;

// Map 的迭代顺序即插入顺序，命中后重新插入即可当作 LRU 的「最近使用」队列
const cache = new Map<string, string>();

/**
 * @description: 按 seed+style+size 取缓存
 * 同一个 key 的 SVG 是确定性的，冷启动或 CDN 未命中时重复请求不必再跑一遍 dicebear
 */
export function getCachedAvatarSvg(key: string): string | undefined {
  const hit = cache.get(key);

  if (hit === undefined) {
    return undefined;
  }

  cache.delete(key);
  cache.set(key, hit);

  return hit;
}

/**
 * @description: 写入缓存，超上限时淘汰最久未命中的条目
 */
export function setCachedAvatarSvg(key: string, svg: string): void {
  cache.set(key, svg);

  while (cache.size > MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;

    if (oldestKey === undefined) {
      break;
    }

    cache.delete(oldestKey);
  }
}
