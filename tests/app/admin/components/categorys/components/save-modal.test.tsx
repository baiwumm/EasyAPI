// @vitest-environment jsdom
/*
 * 分类保存表单（T1）：必填校验 / 提交 payload 形状 / 失败后状态复位。
 * HeroUI v3 组件直接在 jsdom 里渲染，只 mock services 层与 toast 命令式 API。
 */
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useOverlayState } from "@heroui/react";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { Category } from "@/typings";

const { addCategory, updateCategory, toast, handleRefresh } = vi.hoisted(() => ({
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  toast: { success: vi.fn(), danger: vi.fn() },
  handleRefresh: vi.fn(),
}));

vi.mock("@heroui/react", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  toast,
}));

vi.mock("@/services/categorys", () => ({ addCategory, updateCategory }));

import SaveModal from "@/app/admin/components/categorys/components/save-modal";

const CATEGORY: Category = {
  id: "cat-1",
  name: "旧分类名",
  desc: "旧描述",
  sort: 3,
  apis: [],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

/** 包一层真实 useOverlayState，挂载即打开，模拟父组件点「新增/编辑」后的形态 */
function Harness({ initialValues }: { initialValues: Category | null }) {
  const state = useOverlayState();

  useEffect(() => {
    state.open();
    // 仅模拟挂载后打开一次
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SaveModal
      state={state}
      initialValues={initialValues}
      handleRefresh={handleRefresh}
    />
  );
}

const renderModal = (initialValues: Category | null) =>
  render(
    // 每个用例独立 SWR 缓存，避免 mutation key 跨用例串状态
    <SWRConfig value={{ provider: () => new Map() }}>
      <Harness initialValues={initialValues} />
    </SWRConfig>,
  );

const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(await screen.findByRole("button", { name: /确定|正在提交/ }));
};

beforeAll(() => {
  // React Aria 组件依赖 Pointer Capture / scrollIntoView，jsdom 未实现
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

beforeEach(() => {
  addCategory.mockReset();
  updateCategory.mockReset();
  handleRefresh.mockClear();
  toast.success.mockClear();
  toast.danger.mockClear();
});

afterEach(cleanup);

describe("分类保存表单 - 必填校验", () => {
  it("分类名称为空时提交被拦截，不发起请求", async () => {
    const user = userEvent.setup();
    renderModal(null);

    await submit(user);

    await waitFor(() => {
      expect(screen.getByText("请输入分类名称")).toBeInTheDocument();
    });
    expect(addCategory).not.toHaveBeenCalled();
  });

  it("排序被清空时不静默提交 Number('') === 0", async () => {
    const user = userEvent.setup();
    renderModal(null);

    // NumberField 会渲染隐藏 input + 可见 input 两个带「排序」标签的元素，
    // 可见输入框用 textbox role 区分
    const sortInput = screen.getByRole("textbox", { name: "排序" });
    await user.clear(sortInput);
    await submit(user);

    // NumberField 没有渲染 FieldError，校验不产生可见文案，
    // 但原生校验仍应拦下提交（否则 Number('') === 0 会被静默提交）
    expect(sortInput).toBeInvalid();
    expect(addCategory).not.toHaveBeenCalled();
  });
});

describe("分类保存表单 - 提交 payload", () => {
  it("新增模式：提交 name/desc/sort 的正确形状", async () => {
    const user = userEvent.setup();
    addCategory.mockResolvedValue({ code: 200, msg: "成功" });
    renderModal(null);

    await user.type(screen.getByLabelText("分类名称"), "新分类");
    await user.type(screen.getByLabelText("分类描述"), "说明文案");
    // 排序保持默认值 1，不额外操作
    await submit(user);

    await waitFor(() => {
      expect(addCategory).toHaveBeenCalledTimes(1);
    });
    expect(addCategory).toHaveBeenCalledWith({
      name: "新分类",
      desc: "说明文案",
      sort: 1,
      id: undefined,
    });
    expect(updateCategory).not.toHaveBeenCalled();
  });

  it("编辑模式：带 id 走 updateCategory，字段预填", async () => {
    const user = userEvent.setup();
    updateCategory.mockResolvedValue({ code: 200, msg: "成功" });
    renderModal(CATEGORY);

    await user.clear(screen.getByLabelText("分类名称"));
    await user.type(screen.getByLabelText("分类名称"), "改过的名字");
    await submit(user);

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledTimes(1);
    });
    expect(updateCategory).toHaveBeenCalledWith({
      name: "改过的名字",
      desc: "旧描述",
      sort: 3,
      id: "cat-1",
    });
    expect(addCategory).not.toHaveBeenCalled();
  });
});

describe("分类保存表单 - 提交后状态", () => {
  it("失败（code !== 200）：弹窗保持打开，按钮文案复位，不刷新列表", async () => {
    const user = userEvent.setup();
    addCategory.mockResolvedValue({ code: 500, msg: "失败" });
    renderModal(null);

    await user.type(screen.getByLabelText("分类名称"), "会失败的分类");
    await submit(user);

    await waitFor(() => {
      expect(addCategory).toHaveBeenCalledTimes(1);
    });
    // loading 复位：按钮从「正在提交...」回到「确定」
    expect(await screen.findByRole("button", { name: "确定" })).toBeInTheDocument();
    // 弹窗未关闭
    expect(screen.getByText("新增分类")).toBeInTheDocument();
    expect(toast.success).not.toHaveBeenCalled();
    expect(handleRefresh).not.toHaveBeenCalled();
  });

  it("成功：toast + 刷新列表 + 弹窗关闭", async () => {
    const user = userEvent.setup();
    addCategory.mockResolvedValue({ code: 200, msg: "成功" });
    renderModal(null);

    await user.type(screen.getByLabelText("分类名称"), "会成功的分类");
    await submit(user);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("提交成功", expect.anything());
      expect(handleRefresh).toHaveBeenCalled();
    });
    // 弹窗已关闭
    await waitFor(() => {
      expect(screen.queryByText("新增分类")).not.toBeInTheDocument();
    });
  });
});
