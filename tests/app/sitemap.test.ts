import { describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";

/** 构造可链式调用的 PostgREST 查询构建器替身 */
function createQueryBuilder(result: { data: unknown }) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(result),
  };

  return builder;
}

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

describe("sitemap", () => {
  it("返回首页、全部工具页与 /docs 的 URL 清单", async () => {
    createClientMock.mockReturnValue({
      from: (table: string) =>
        createQueryBuilder({
          data:
            table === "ea_apis" ? [{ created_at: "2026-06-01T00:00:00Z" }] : [],
        }),
    });

    const routes = await sitemap();
    const urls = routes.map((route) => route.url);

    expect(urls).toContain("https://api.baiwumm.com");
    expect(urls).toContain("https://api.baiwumm.com/docs");
    expect(urls).toContain("https://api.baiwumm.com/bmi");
    expect(urls).toHaveLength(1 + 35 + 1);
  });

  it("lastmod 取接口与分类 created_at 的最大值，而不是每次构建刷新", async () => {
    createClientMock.mockReturnValue({
      from: (table: string) =>
        createQueryBuilder({
          data:
            table === "ea_apis"
              ? [{ created_at: "2026-06-01T00:00:00Z" }]
              : [{ created_at: "2026-09-15T00:00:00Z" }],
        }),
    });

    const routes = await sitemap();

    expect(routes[0]?.lastModified).toEqual(new Date("2026-09-15T00:00:00Z"));
  });

  it("查询失败时回退为 Date 实例，不阻断 sitemap 生成", async () => {
    createClientMock.mockImplementation(() => {
      throw new Error("build without supabase env");
    });

    const routes = await sitemap();

    expect(routes[0]?.lastModified).toBeInstanceOf(Date);
  });
});
