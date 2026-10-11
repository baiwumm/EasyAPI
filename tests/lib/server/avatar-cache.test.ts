import { describe, expect, it } from "vitest";

import {
  MAX_ENTRIES_FOR_TEST,
  getCachedAvatarSvg,
  setCachedAvatarSvg,
} from "@/lib/server/avatar-cache";

// 每个用例用独立 key 前缀，避免跨用例串状态（模块级缓存没有 clear API）
describe("头像 SVG LRU 缓存", () => {
  it("写入后能读回", () => {
    setCachedAvatarSvg("rw-1", "<svg>1</svg>");

    expect(getCachedAvatarSvg("rw-1")).toBe("<svg>1</svg>");
  });

  it("未写入的 key 返回 undefined", () => {
    expect(getCachedAvatarSvg("never-written")).toBeUndefined();
  });

  it("命中后重新入队：最久未命中的先被淘汰", () => {
    const total = MAX_ENTRIES_FOR_TEST;

    for (let i = 0; i < total; i++) {
      setCachedAvatarSvg(`lru-${i}`, `v${i}`);
    }

    // 读一次 lru-0，它就不再是最久未使用
    expect(getCachedAvatarSvg("lru-0")).toBe("v0");

    // 写入第 total+1 条，淘汰的是 lru-1 而不是刚被读过的 lru-0
    setCachedAvatarSvg("lru-new", "v-new");

    expect(getCachedAvatarSvg("lru-0")).toBe("v0");
    expect(getCachedAvatarSvg("lru-1")).toBeUndefined();
    expect(getCachedAvatarSvg("lru-new")).toBe("v-new");
  });

  it("超过上限时缓存规模被压回上限内", () => {
    // 写满两倍上限，留下的应该只有最后 200 条
    for (let i = 0; i < MAX_ENTRIES_FOR_TEST * 2; i++) {
      setCachedAvatarSvg(`cap-${i}`, `v${i}`);
    }

    expect(getCachedAvatarSvg("cap-0")).toBeUndefined();
    expect(getCachedAvatarSvg(`cap-${MAX_ENTRIES_FOR_TEST}`)).toBe(
      `v${MAX_ENTRIES_FOR_TEST}`,
    );
    expect(getCachedAvatarSvg(`cap-${MAX_ENTRIES_FOR_TEST * 2 - 1}`)).toBe(
      `v${MAX_ENTRIES_FOR_TEST * 2 - 1}`,
    );
  });
});
