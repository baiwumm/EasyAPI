// @vitest-environment jsdom
/*
 * 登录页 OAuth 回跳（redirectTo）：回各环境的服务端回调路由 /auth/callback
 * ——code 落地即服务端交换并 302 到干净地址，地址栏几乎看不到交换码。
 * 本地开发回 localhost、线上回线上，不依赖 NEXT_PUBLIC_APP_URL 与部署环境对齐。
 * （Supabase 侧要求各环境 /auth/callback 地址在 Redirect URLs 白名单内，
 * 否则回退 Site URL、退化为浏览器端交换）
 */
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { signInWithOAuth, signInWithPassword } = vi.hoisted(() => ({
  signInWithOAuth: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: () => ({
    auth: { signInWithOAuth, signInWithPassword },
  }),
}));

vi.mock("@bprogress/next/app", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next/image", () => ({ default: () => <img alt="Logo" src="/logo.png" /> }));

vi.mock("@heroui/react", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    danger: vi.fn(),
    promise: vi.fn(),
  }),
}));

import ClientComponent from "@/app/login/ClientComponent";

beforeEach(() => {
  signInWithOAuth.mockReset();
  signInWithOAuth.mockResolvedValue({ error: null });
  signInWithPassword.mockReset();
});

afterEach(cleanup);

describe("登录页 OAuth redirectTo", () => {
  it("Github 登录回跳服务端回调路由（jsdom 默认 http://localhost:3000）", async () => {
    const user = userEvent.setup();
    render(<ClientComponent />);

    await user.click(await screen.findByRole("button", { name: /Github/i }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  });

  it("Google 登录同样回跳服务端回调路由", async () => {
    const user = userEvent.setup();
    render(<ClientComponent />);

    await user.click(await screen.findByRole("button", { name: /Google/i }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  });
});
