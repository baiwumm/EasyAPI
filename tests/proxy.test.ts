import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/*
 * 代理层（C6/C7 整改后的结构）：
 * - /api/*：只读 GET 计数，不进会话流程
 * - 页面：updateSession 刷新会话并携带刷新 cookie（?code= 不再被 rewrite 丢弃）
 * - 守卫：admin 白名单、登录页互斥跳转
 */
const { state, createServerClient } = vi.hoisted(() => {
  const state = {
    claims: null as Record<string, unknown> | null,
    /** 模拟 token 续期：getClaims 时经 setAll 写回的刷新 cookie */
    refreshCookies: [] as { name: string; value: string }[],
    rpcCalls: [] as Array<{ name: string; params: Record<string, unknown> }>,
    fromCalls: [] as string[],
    getClaimsCalls: 0,
  };

  return {
    state,
    createServerClient: vi.fn(
      (
        _url: string,
        _key: string,
        options: {
          cookies: {
            setAll: (cookies: { name: string; value: string }[]) => void;
          };
        },
      ) => ({
        auth: {
          getClaims: async () => {
            state.getClaimsCalls += 1;

            if (state.refreshCookies.length) {
              options.cookies.setAll(state.refreshCookies);
            }

            return { data: { claims: state.claims } };
          },
        },
        // C5 后中间件不再查 ea_apis；保留记录以便断言「完全没被调用」
        from: (table: string) => {
          state.fromCalls.push(table);

          const chain = {
            select: () => chain,
            eq: () => chain,
            limit: () => chain,
            maybeSingle: async () => ({ data: { id: "api-row-1" } }),
          };

          return chain;
        },
        rpc: async (name: string, params: Record<string, unknown>) => {
          state.rpcCalls.push({ name, params });

          return { error: null };
        },
      }),
    ),
  };
});

vi.mock("@supabase/ssr", () => ({ createServerClient }));

import proxy from "@/proxy";

const req = (url: string, init?: { method: string }) =>
  new NextRequest(`http://x${url}`, init);

beforeEach(() => {
  vi.stubEnv("ADMIN_EMAILS", "admin@x.com");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://stub.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "stub-key");
  state.claims = null;
  state.refreshCookies = [];
  state.rpcCalls = [];
  state.fromCalls = [];
  state.getClaimsCalls = 0;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("代理层 /api 分支", () => {
  it("只读 GET 直接按 path 发计数 RPC，不再预查 ea_apis（C5）", async () => {
    const res = await proxy(req("/api/bmi?h=1"));

    expect(res.status).toBe(200);
    // C5：省掉存在性检查，每个 GET 只剩一轮 DB 往返
    expect(state.fromCalls).toEqual([]);
    expect(state.rpcCalls).toHaveLength(1);
    expect(state.rpcCalls[0].name).toBe("increment_call_count_by_path");
    // F1：按 path 计数，未收录 path 由函数内部 no-op
    expect(state.rpcCalls[0].params).toEqual({ p_path: "/bmi" });
  });

  it("写方法（管理端 CRUD）不计数", async () => {
    await proxy(req("/api/apis", { method: "POST" }));

    expect(state.rpcCalls).toHaveLength(0);
  });

  it("/api 不进入会话流程（不触发 getClaims）", async () => {
    await proxy(req("/api/bmi"));

    expect(state.getClaimsCalls).toBe(0);
  });
});

describe("代理层 会话刷新", () => {
  it("页面导航触发 getClaims 刷新会话", async () => {
    const res = await proxy(req("/"));

    expect(state.getClaimsCalls).toBe(1);
    expect(res.status).toBe(200);
  });

  it("token 续期后响应携带刷新 cookie（C7：不再被 rewrite 丢弃）", async () => {
    state.refreshCookies = [{ name: "sb-refresh", value: "new-token" }];

    const res = await proxy(req("/"));

    expect(res.cookies.get("sb-refresh")?.value).toBe("new-token");
  });

  it("URL 带 ?code= 时原样放行，cookie 照常写入、地址栏参数交给浏览器端交换", async () => {
    state.refreshCookies = [{ name: "sb-refresh", value: "new-token" }];

    const res = await proxy(req("/login?code=auth-code-1"));

    expect(res.headers.get("location")).toBeNull();
    expect(res.cookies.get("sb-refresh")?.value).toBe("new-token");
  });
});

describe("代理层 路由守卫", () => {
  it("未登录访问 /admin 跳转登录页", async () => {
    const res = await proxy(req("/admin"));

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://x/login");
  });

  it("已登录但邮箱不在白名单，访问 /admin 也跳登录页", async () => {
    state.claims = { email: "user@x.com" };

    const res = await proxy(req("/admin/apis"));

    expect(res.headers.get("location")).toBe("http://x/login");
  });

  it("白名单管理员访问 /admin 正常放行", async () => {
    state.claims = { email: "Admin@X.com" };

    const res = await proxy(req("/admin"));

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("普通用户访问 /login 跳回首页，管理员跳管理页", async () => {
    state.claims = { email: "user@x.com" };
    const userRes = await proxy(req("/login"));
    expect(userRes.headers.get("location")).toBe("http://x/");

    state.claims = { email: "admin@x.com" };
    const adminRes = await proxy(req("/login"));
    expect(adminRes.headers.get("location")).toBe("http://x/admin");
  });

  it("未登录访问公开页面不跳转", async () => {
    const res = await proxy(req("/bmi"));

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
