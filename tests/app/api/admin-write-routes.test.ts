import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// 写路由链式调用形态：insert/update/delete(...).select().single() 后解构 { data, error }
const { supabase, revalidateHome, requireAdmin } = vi.hoisted(() => ({
  supabase: {
    from: vi.fn(),
  },
  revalidateHome: vi.fn(),
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: async () => supabase,
  requireAdmin: () => requireAdmin(),
}));

// next/cache 的真实实现只在 Next 运行时有效，测试里换成记录型替身，
// 用来断言「写成功才刷新首页」
vi.mock("next/cache", () => ({
  revalidatePath: () => revalidateHome(),
}));

import { POST as createApi } from "@/app/api/apis/route";
import {
  DELETE as deleteApi,
  PUT as updateApi,
} from "@/app/api/apis/[id]/route";
import { POST as createCategory } from "@/app/api/categorys/route";
import {
  DELETE as deleteCategory,
  PUT as updateCategory,
} from "@/app/api/categorys/[id]/route";

/** 让写操作 resolve 到指定结果 */
function writeReturns(result: { data: unknown; error: unknown }) {
  const api: Record<string, unknown> = {
    insert: vi.fn(() => api),
    update: vi.fn(() => api),
    delete: vi.fn(() => api),
    select: vi.fn(() => api),
    eq: vi.fn(() => api),
    single: vi.fn(() => api),
    // 删除分类前会先 count 一次，count 也走同一条链
    then: (resolve: (v: unknown) => void) => resolve(result),
  };

  supabase.from.mockReturnValue(api);

  return api;
}

const post = (url: string, body: unknown) =>
  new NextRequest(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const put = (url: string, body: unknown) =>
  new NextRequest(url, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const del = (url: string) => new NextRequest(url, { method: "DELETE" });

async function json(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
  };
}

const API_BODY = {
  category_id: "0f7f1b1e-6d4a-4c8b-9f2e-1a2b3c4d5e6f",
  name: "每日推荐",
  path: "/chicken-soup",
  method: "GET",
  sort: 1,
};

describe("管理端写接口成功后刷新首页（F2）", () => {
  beforeEach(() => {
    supabase.from.mockReset();
    revalidateHome.mockClear();
    requireAdmin.mockResolvedValue({ email: "me@baiwumm.com" });
  });

  it("POST /api/apis 成功后刷新首页", async () => {
    writeReturns({ data: { id: "1" }, error: null });

    const res = await createApi(post("http://x/api/apis", API_BODY));

    expect((await json(res)).code).toBe(200);
    expect(revalidateHome).toHaveBeenCalledTimes(1);
  });

  it("PUT /api/apis/[id] 成功后刷新首页", async () => {
    writeReturns({ data: { id: "1" }, error: null });

    const res = await updateApi(
      put("http://x/api/apis/1", { name: "新名字" }),
      { params: Promise.resolve({ id: "1" }) },
    );

    expect((await json(res)).code).toBe(200);
    expect(revalidateHome).toHaveBeenCalledTimes(1);
  });

  it("DELETE /api/apis/[id] 成功后刷新首页", async () => {
    writeReturns({ data: { id: "1" }, error: null });

    const res = await deleteApi(del("http://x/api/apis/1"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect((await json(res)).code).toBe(200);
    expect(revalidateHome).toHaveBeenCalledTimes(1);
  });

  it("POST /api/categorys 成功后刷新首页", async () => {
    writeReturns({ data: { id: "1" }, error: null });

    const res = await createCategory(
      post("http://x/api/categorys", { name: "新分类", sort: 1 }),
    );

    expect((await json(res)).code).toBe(200);
    expect(revalidateHome).toHaveBeenCalledTimes(1);
  });

  it("PUT /api/categorys/[id] 成功后刷新首页", async () => {
    writeReturns({ data: { id: "1" }, error: null });

    const res = await updateCategory(
      put("http://x/api/categorys/1", { name: "新分类名" }),
      { params: Promise.resolve({ id: "1" }) },
    );

    expect((await json(res)).code).toBe(200);
    expect(revalidateHome).toHaveBeenCalledTimes(1);
  });

  it("DELETE /api/categorys/[id] 成功后刷新首页", async () => {
    writeReturns({ data: { id: "1" }, error: null });

    const res = await deleteCategory(del("http://x/api/categorys/1"), {
      params: Promise.resolve({ id: "1" }),
    });

    expect((await json(res)).code).toBe(200);
    expect(revalidateHome).toHaveBeenCalledTimes(1);
  });

  it("写失败时不刷新首页（首页内容没变）", async () => {
    writeReturns({ data: null, error: { message: "boom", code: "42P01" } });

    const res = await createApi(post("http://x/api/apis", API_BODY));

    expect((await json(res)).code).toBe(500);
    expect(revalidateHome).not.toHaveBeenCalled();
  });

  it("未登录/无权限时不刷新首页", async () => {
    requireAdmin.mockResolvedValue(null);

    const res = await createApi(post("http://x/api/apis", API_BODY));

    expect((await json(res)).code).toBe(500);
    expect(revalidateHome).not.toHaveBeenCalled();
  });
});

// C14 落到路由层：update({}) 会被写守卫拦在数据库之前
describe("管理端写接口的请求体守卫", () => {
  beforeEach(() => {
    supabase.from.mockReset();
    revalidateHome.mockClear();
    requireAdmin.mockResolvedValue({ email: "me@baiwumm.com" });
  });

  it("PUT 空 payload 返回 500，不打数据库也不刷新首页", async () => {
    const res = await updateApi(put("http://x/api/apis/1", {}), {
      params: Promise.resolve({ id: "1" }),
    });

    const b = await json(res);

    expect(b.code).toBe(500);
    expect(b.msg).toBe("没有需要更新的字段");
    expect(supabase.from).not.toHaveBeenCalled();
    expect(revalidateHome).not.toHaveBeenCalled();
  });

  it("PUT sort 越界返回 500，不打数据库", async () => {
    const res = await updateApi(put("http://x/api/apis/1", { sort: -999 }), {
      params: Promise.resolve({ id: "1" }),
    });

    expect((await json(res)).msg).toContain("sort");
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
