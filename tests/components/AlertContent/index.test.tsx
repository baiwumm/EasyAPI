// @vitest-environment jsdom
/*
 * D15：AlertContent / ErrorContent 的操作按钮只保留一套。
 * 此前桌面/移动两套按钮都挂在 DOM（sm:hidden / hidden sm:block），
 * 键盘用户会 Tab 到视觉隐藏的重复按钮——回归点：任意时刻同名按钮只有一个
 */
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";

import AlertContent from "@/components/AlertContent";
import ErrorContent from "@/components/ErrorContent";

beforeAll(() => {
  // React Aria 依赖 Pointer Capture / scrollIntoView，jsdom 未实现
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterEach(cleanup);

describe("AlertContent 操作按钮", () => {
  it("DOM 中只渲染一个操作按钮（无隐藏重复副本）", () => {
    render(
      <AlertContent
        buttonAction={() => {}}
        description="接口配额已用尽"
        actionText="去处理"
        status="warning"
        title="配额提醒"
      />,
    );

    expect(screen.getAllByRole("button", { name: "去处理" })).toHaveLength(1);
  });

  it("标题与描述正常渲染", () => {
    render(
      <AlertContent
        buttonAction={() => {}}
        description="接口配额已用尽"
        actionText="去处理"
        status="warning"
        title="配额提醒"
      />,
    );

    expect(screen.getByText("配额提醒")).toBeInTheDocument();
    expect(screen.getByText("接口配额已用尽")).toBeInTheDocument();
  });

  it("点击按钮触发 buttonAction", async () => {
    const user = userEvent.setup();
    const buttonAction = vi.fn();
    render(
      <AlertContent
        buttonAction={buttonAction}
        description="接口配额已用尽"
        actionText="去处理"
        status="warning"
        title="配额提醒"
      />,
    );

    await user.click(screen.getByRole("button", { name: "去处理" }));
    expect(buttonAction).toHaveBeenCalledTimes(1);
  });
});

describe("ErrorContent 重试按钮", () => {
  it("DOM 中只渲染一个重试按钮（无隐藏重复副本）", () => {
    render(<ErrorContent refresh={() => {}} />);

    expect(screen.getAllByRole("button", { name: "重试" })).toHaveLength(1);
    expect(screen.getByText("获取接口数据失败，请稍后重试")).toBeInTheDocument();
  });

  it("点击重试触发 refresh", async () => {
    const user = userEvent.setup();
    const refresh = vi.fn();
    render(<ErrorContent refresh={refresh} />);

    await user.click(screen.getByRole("button", { name: "重试" }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
