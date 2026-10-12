// @vitest-environment jsdom
/*
 * 登录页 OAuth 回跳（redirectTo）：从哪个地址发起登录就回哪个地址，
 * 本地开发回 localhost、线上回线上，不依赖 NEXT_PUBLIC_APP_URL 与部署环境对齐。
 * （Supabase 侧要求各环境 origin 在 Redirect URLs 白名单内，否则回退 Site URL）
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
  it("Github 登录回跳当前站点源（jsdom 默认 http://localhost:3000）", async () => {
    const user = userEvent.setup();
    render(<ClientComponent />);

    await user.click(await screen.findByRole("button", { name: /Github/i }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
  });

  it("Google 登录同样回跳当前站点源", async () => {
    const user = userEvent.setup();
    render(<ClientComponent />);

    await user.click(await screen.findByRole("button", { name: /Google/i }));

    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  });
});
