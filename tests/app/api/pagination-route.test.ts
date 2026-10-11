import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// 分页校验发生在创建 Supabase 客户端之前，用假客户端记录 range() 收到的参数
const { supabase } = vi.hoisted(() => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: async () => supabase,
}));

import { GET as listApis } from "@/app/api/apis/route";
import { GET as listCategorys } from "@/app/api/categorys/route";

/** 记录链式调用，并把 limit/range 的参数暴露出来 */
function chain(result: { data: unknown; error: unknown }) {
  const calls: Record<string, unknown[]> = { range: [], limit: [] };
  const api: Record<string, unknown> = {
    select: vi.fn(() => api),
    or: vi.fn(() => api),
    eq: vi.fn(() => api),
    like: vi.fn(() => api),
    order: vi.fn(() => api),
    limit: vi.fn((...args) => {
      (calls.limit as unknown[]).push(args);

      return api;
    }),
    range: vi.fn((...args) => {
      (calls.range as unknown[]).push(args);

      return api;
    }),
    then: (resolve: (v: unknown) => void) => resolve(result),
  };

  supabase.from.mockReturnValue(api);

  return calls;
}

const req = (query: string) =>
  new NextRequest(`http://x/api/apis?${query}`);

const reqCategorys = (query: string) =>
  new NextRequest(`http://x/api/categorys?${query}`);

async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
  };
}

describe("分页参数钳制（D19）", () => {
  beforeEach(() => {
    supabase.from.mockReset();
  });

  // parseInt("1e9") 截断成 1（见 audit 里钉住的 parseBoundedInt 行为），
  // 关键是 1e9 不会原样进 range() 让 PostgREST 报错
  it("pageIndex=1e9 被截断成 1，不会把大偏移透给 range()", async () => {
    const calls = chain({ data: [], error: null });

    const res = await listApis(req("pageIndex=1e9&pageSize=10"));
    const b = await body(res);

    expect(b.code).toBe(200);
    expect(calls.range).toEqual([[10, 19]]);
  });

  it("pageIndex 超大整数被钳制到上限 10000", async () => {
    const calls = chain({ data: [], error: null });

    await listApis(req("pageIndex=99999&pageSize=10"));

    expect(calls.range).toEqual([[100000, 100009]]);
  });

  it("pageIndex 为负时按 0 处理", async () => {
    const calls = chain({ data: [], error: null });

    await listApis(req("pageIndex=-5"));

    expect(calls.range).toEqual([[0, 9]]);
  });

  it("pageIndex 非数字时按默认 0 处理", async () => {
    const calls = chain({ data: [], error: null });

    await listApis(req("pageIndex=abc"));

    expect(calls.range).toEqual([[0, 9]]);
  });

  it("pageSize 仍钳制在 1 ~ 1000", async () => {
    const calls = chain({ data: [], error: null });

    await listApis(req("pageSize=99999"));

    expect(calls.range).toEqual([[0, 999]]);
  });

  it("正常分页参数原样透传", async () => {
    const calls = chain({ data: [], error: null });

    await listApis(req("pageIndex=2&pageSize=20"));

    expect(calls.range).toEqual([[40, 59]]);
  });

  it("分类列表同样钳制", async () => {
    const calls = chain({ data: [], error: null });

    const b = await body(await listCategorys(reqCategorys("pageIndex=99999")));

    expect(b.code).toBe(200);
    expect(calls.range).toEqual([[100000, 100009]]);
  });
});
