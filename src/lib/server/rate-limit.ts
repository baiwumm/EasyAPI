/*
 * @Description: 固定窗口内存限流（按调用方维度）
 */
interface RateLimiterOptions {
  /** 单个窗口内允许的请求数 */
  limit: number;
  /** 窗口长度（毫秒） */
  windowMs: number;
  /** 键数量上限，超过先清理过期桶，仍满则整体重置 */
  maxKeys?: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * @description: 创建固定窗口限流器
 *
 * Serverless / 多实例部署下每个实例独立计数，做不到全局精确，
 * 目的是把「拿一个公开接口当算力放大器」的成本抬到不可接受，
 * 不是精确配额，因此计数只落在进程内存里、不做任何持久化。
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5000,
}: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>();

  return {
    /** 未超限返回 true（放行），超过返回 false（拒绝） */
    check(key: string): boolean {
      const now = Date.now();

      // 键规模触顶时先清过期桶；极端情况仍满就整体重置，
      // 宁可让所有窗口重新开始，也不能把正常调用方一直挡在外面
      if (buckets.size >= maxKeys) {
        for (const [k, bucket] of buckets) {
          if (bucket.resetAt <= now) {
            buckets.delete(k);
          }
        }

        if (buckets.size >= maxKeys) {
          buckets.clear();
        }
      }

      const bucket = buckets.get(key);

      // 首个请求或窗口已结束：开新窗口
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });

        return true;
      }

      bucket.count += 1;

      return bucket.count <= limit;
    },
  };
}
