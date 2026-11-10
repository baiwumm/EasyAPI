import { describe, expect, it } from "vitest";
import type { User } from "@supabase/supabase-js";

import { getAvatarCandidates, getUserDisplayName } from "@/lib/user-profile";

const GITHUB_AVATAR = "https://avatars.githubusercontent.com/u/40554571?v=4";
const GOOGLE_AVATAR =
  "https://lh3.googleusercontent.com/a/ACg8ocJ-demo=s96-c";

/** 按 Supabase User 的形状构造最小测试数据 */
function makeUser(overrides: Record<string, unknown>): User {
  return {
    id: "u1",
    email: "me@baiwumm.com",
    user_metadata: {},
    identities: [],
    ...overrides,
  } as unknown as User;
}

describe("getAvatarCandidates 头像候选链", () => {
  it("GitHub 身份头像优先于登录资料头像（metadata 会被上次 provider 覆盖）", () => {
    const user = makeUser({
      user_metadata: { avatar_url: GOOGLE_AVATAR },
      identities: [
        { provider: "google", identity_data: { avatar_url: GOOGLE_AVATAR } },
        { provider: "github", identity_data: { avatar_url: GITHUB_AVATAR } },
      ],
    });

    expect(getAvatarCandidates(user)).toEqual([
      GITHUB_AVATAR,
      GOOGLE_AVATAR,
      "/avatar.png",
    ]);
  });

  it("无 GitHub 身份时回退登录资料头像", () => {
    const user = makeUser({
      user_metadata: { avatar_url: GOOGLE_AVATAR },
      identities: [
        { provider: "google", identity_data: { avatar_url: GOOGLE_AVATAR } },
      ],
    });

    expect(getAvatarCandidates(user)).toEqual([GOOGLE_AVATAR, "/avatar.png"]);
  });

  it("远程头像都没有时只留本地兜底", () => {
    const user = makeUser({ user_metadata: {}, identities: [] });

    expect(getAvatarCandidates(user)).toEqual(["/avatar.png"]);
  });

  it("重复地址去重（GitHub 与 metadata 相同时不重复预加载）", () => {
    const user = makeUser({
      user_metadata: { avatar_url: GITHUB_AVATAR },
      identities: [
        { provider: "github", identity_data: { avatar_url: GITHUB_AVATAR } },
      ],
    });

    expect(getAvatarCandidates(user)).toEqual([GITHUB_AVATAR, "/avatar.png"]);
  });

  it("未登录返回本地兜底，不抛错", () => {
    expect(getAvatarCandidates(null)).toEqual(["/avatar.png"]);
  });
});

describe("getUserDisplayName 展示名", () => {
  it("GitHub 用户名优先（不展示真名）", () => {
    const user = makeUser({
      user_metadata: { name: "白雾茫茫丶", user_name: "baiwumm" },
    });

    expect(getUserDisplayName(user)).toBe("baiwumm");
  });

  it("无 user_name 时回退 preferred_username，再回退 name", () => {
    expect(
      getUserDisplayName(
        makeUser({ user_metadata: { preferred_username: "pn", name: "n" } }),
      ),
    ).toBe("pn");
    expect(getUserDisplayName(makeUser({ user_metadata: { name: "n" } }))).toBe(
      "n",
    );
  });

  it("全部缺失时回退邮箱首字符，未登录返回空串", () => {
    expect(getUserDisplayName(makeUser({ user_metadata: {} }))).toBe("m");
    expect(getUserDisplayName(null)).toBe("");
  });
});
