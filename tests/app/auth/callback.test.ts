import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { exchangeCodeForSession, createServerClient } = vi.hoisted(() => {
  const exchangeCodeForSession = vi.fn();

  return {
    exchangeCodeForSession,
    createServerClient: vi.fn(() => ({
      auth: { exchangeCodeForSession },
    })),
  };
});

vi.mock("@supabase/ssr", () => ({ createServerClient }));

import { GET } from "@/app/auth/callback/route";

const req = (search: string) =>
  new NextRequest(`http://x/auth/callback${search}`);

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://stub.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "stub-key");
  exchangeCodeForSession.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("OAuth 回调路由", () => {
  it("注册开关拒绝（只有错误参数没有 code）→ 带错误码回登录页", async () => {
    const res = await GET(
      req("?error=access_denied&error_code=signup_disabled"),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://x/login?error=signup_disabled",
    );
  });

  it("用户取消授权（无 error_code）→ 透传通用错误码", async () => {
    const res = await GET(req("?error=access_denied"));

    expect(res.headers.get("location")).toBe(
      "http://x/login?error=access_denied",
    );
  });

  it("无 code 无错误 → server_error 回登录页", async () => {
    const res = await GET(req("?"));

    expect(res.headers.get("location")).toBe("http://x/login?error=server_error");
  });

  it("code 交换成功 → 重定向干净首页", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const res = await GET(req("?code=auth-code-1"));

    expect(exchangeCodeForSession).toHaveBeenCalledWith("auth-code-1");
    expect(res.headers.get("location")).toBe("http://x/");
  });

  it("code 交换失败 → server_error 回登录页", async () => {
    exchangeCodeForSession.mockResolvedValue({
      error: { message: "bad code" },
    });

    const res = await GET(req("?code=expired"));

    expect(res.headers.get("location")).toBe("http://x/login?error=server_error");
  });
});
