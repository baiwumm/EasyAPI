// @vitest-environment jsdom
/*
 * D13：StaggerIn 不再给每个 child 包 motion.div——额外包装会破坏
 * grid/flex 布局。回归点：容器下就是调用方给的真实子元素，
 * 没有任何中间包装节点，且容器携带 stagger-in 类与调用方 className
 */
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";

import StaggerIn from "@/components/StaggerIn";

afterEach(cleanup);

describe("StaggerIn 结构（无包装 DOM）", () => {
  it("直接子节点就是调用方的元素，数量一致且无中间包装", () => {
    const { container } = render(
      <StaggerIn>
        <span>一</span>
        <span>二</span>
        <span>三</span>
      </StaggerIn>,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass("stagger-in");
    expect(wrapper.children).toHaveLength(3);
    // 每个直接子节点都是调用方的 span，而不是包装用的 div
    for (const child of wrapper.children) {
      expect(child.tagName).toBe("SPAN");
    }
  });

  it("className 透传到容器（与 stagger-in 共存）", () => {
    const { container } = render(
      <StaggerIn className="flex flex-wrap gap-2">
        <i />
      </StaggerIn>,
    );

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass("stagger-in", "flex", "flex-wrap", "gap-2");
  });

  it("文本子节点不参与 nth-child 计数（CSS 只数元素）", () => {
    const { container } = render(
      <StaggerIn>
        {"纯文本"}
        <span>元素</span>
      </StaggerIn>,
    );

    const wrapper = container.firstChild as HTMLElement;

    // 元素子节点只有 1 个 span，文本节点不会多占交错档位
    expect(wrapper.children).toHaveLength(1);
  });
});
