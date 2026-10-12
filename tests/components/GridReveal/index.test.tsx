// @vitest-environment jsdom
/*
 * GridReveal 首屏外降级行为（F7）：
 * 1. 初始渲染为普通 <img>（原生懒加载），不建 canvas、不跑引擎
 * 2. IntersectionObserver 报告进入视口（150px 边距）后才挂载 canvas 引擎
 * 3. reduce-motion 用户保持普通 <img>，永不挂载引擎
 * 4. 无 src 时两者都不渲染；img 加载完成即触发 onRevealComplete
 */
import { render, screen, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

/** reduce-motion 开关（mock 掉 motion 的 useReducedMotion，避免依赖 matchMedia） */
const { reducedMotion } = vi.hoisted(() => ({
  reducedMotion: { current: false },
}));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useReducedMotion: () => reducedMotion.current,
}));

import GridReveal from "@/components/GridReveal";

/** 捕获 IntersectionObserver 实例，供测试手动触发相交 */
const observers: {
  callback: IntersectionObserverCallback;
  disconnected: boolean;
}[] = [];

class IOStub {
  constructor(callback: IntersectionObserverCallback) {
    observers.push({ callback, disconnected: false });
  }

  observe() {}

  unobserve() {}

  disconnect() {
    observers.forEach((o) => {
      o.disconnected = true;
    });
  }

  takeRecords() {
    return [];
  }
}

const fireIntersecting = () => {
  const entry = { isIntersecting: true } as IntersectionObserverEntry;

  observers.forEach((o) => o.callback([entry], {} as IntersectionObserver));
};

const SRC = "https://picsum.photos/seed/testseed/128/128";

beforeAll(() => {
  vi.stubGlobal("IntersectionObserver", IOStub);
  // jsdom 无 canvas 包：getContext 返回 null 且打噪音，直接打桩。
  // 引擎 effect 拿到 null ctx 会直接返回——本文件只验证挂载/降级结构
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterAll(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  observers.length = 0;
  reducedMotion.current = false;
});

describe("GridReveal 首屏外降级", () => {
  it("初始渲染为普通 <img>：懒加载、无 canvas", () => {
    render(<GridReveal alt="随机图片" src={SRC} />);

    const img = screen.getByRole("img", { name: "随机图片" });

    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("src", SRC);
    expect(document.querySelector("canvas")).toBeNull();
    expect(observers).toHaveLength(1);
  });

  it("进入视口后挂载 canvas 引擎，img 让位", async () => {
    render(<GridReveal alt="随机图片" src={SRC} />);

    expect(document.querySelector("canvas")).toBeNull();

    await act(async () => {
      fireIntersecting();
    });

    const canvas = document.querySelector("canvas");

    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute("role", "img");
    expect(canvas).toHaveAttribute("aria-label", "随机图片");
    // img 卸载，避免无障碍树里出现两个 img 角色
    expect(document.querySelector("img")).toBeNull();
  });

  it("reduce-motion 用户保持普通 <img>，相交也不挂引擎", async () => {
    reducedMotion.current = true;
    render(<GridReveal alt="随机图片" src={SRC} />);

    await act(async () => {
      fireIntersecting();
    });

    expect(screen.getByRole("img", { name: "随机图片" }).tagName).toBe("IMG");
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("无 src 时既不渲染 img 也不渲染 canvas", () => {
    render(<GridReveal alt="随机图片" />);

    expect(document.querySelector("img")).toBeNull();
    expect(document.querySelector("canvas")).toBeNull();
    // 没有可观察内容时不创建观察器
    expect(observers).toHaveLength(0);
  });

  it("环境没有 IntersectionObserver 时保持普通 <img>（优雅降级）", () => {
    vi.unstubAllGlobals();
    render(<GridReveal alt="随机图片" src={SRC} />);

    expect(screen.getByRole("img", { name: "随机图片" }).tagName).toBe("IMG");
    expect(document.querySelector("canvas")).toBeNull();

    // 恢复给后续用例
    vi.stubGlobal("IntersectionObserver", IOStub);
  });

  it("降级态 img 加载完成即触发 onRevealComplete", async () => {
    const onRevealComplete = vi.fn();
    render(<GridReveal alt="随机图片" src={SRC} onRevealComplete={onRevealComplete} />);

    await act(async () => {
      screen.getByRole("img", { name: "随机图片" }).dispatchEvent(new Event("load"));
    });

    expect(onRevealComplete).toHaveBeenCalledTimes(1);
  });

  it("降级态 img 加载失败触发 onError", async () => {
    const onError = vi.fn();
    render(<GridReveal alt="随机图片" src={SRC} onError={onError} />);

    await act(async () => {
      screen.getByRole("img", { name: "随机图片" }).dispatchEvent(new Event("error"));
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });
});
