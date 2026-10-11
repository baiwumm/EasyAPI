import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createRateLimiter } from "@/lib/server/rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("窗口内放行到 limit，第 limit+1 次被拒", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });

    expect([limiter.check("a"), limiter.check("a"), limiter.check("a")]).toEqual([
      true,
      true,
      true,
    ]);
    expect(limiter.check("a")).toBe(false);
  });

  it("不同 key 独立计数", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
    expect(limiter.check("b")).toBe(true);
  });

  it("窗口结束后计数重置", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);

    vi.advanceTimersByTime(1001);

    expect(limiter.check("a")).toBe(true);
  });

  it("窗口内超限的请求不会把计数继续叠加", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });

    limiter.check("a");
    limiter.check("a");
    limiter.check("a");
    limiter.check("a");

    vi.advanceTimersByTime(1001);

    // 超限的那些请求不参与计数，新窗口里仍是完整的 2 次额度
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
  });

  it("过期桶被清理，不会无限占用内存", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });

    limiter.check("a");
    limiter.check("b");

    vi.advanceTimersByTime(1001);

    // 两个桶都已过期：触发清理而非整体重置
    expect(limiter.check("c")).toBe(true);
    expect(limiter.check("a")).toBe(true);
  });

  it("过期桶清理后仍满时整体重置，不会把正常调用方永久挡死", () => {
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 1000,
      maxKeys: 2,
    });

    // 制造出「都还没过期但已满」的状态
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("b")).toBe(true);

    // 新 key 触发重置逻辑，仍能放行
    expect(limiter.check("c")).toBe(true);
  });
});
