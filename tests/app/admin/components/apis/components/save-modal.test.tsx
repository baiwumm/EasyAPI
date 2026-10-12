// @vitest-environment jsdom
/*
 * 接口保存表单（T1）：必填校验 / 路径格式校验 / 提交 payload 形状 / 提交后状态。
 * Select 弹层用真实交互点开（React Aria 在 jsdom 下需要 pointer capture 垫片）。
 */
import { render, screen, cleanup, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useOverlayState } from "@heroui/react";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { Api, Category } from "@/typings";

const { addApi, updateApi, toast, handleRefresh } = vi.hoisted(() => ({
  addApi: vi.fn(),
  updateApi: vi.fn(),
  toast: { success: vi.fn(), danger: vi.fn() },
  handleRefresh: vi.fn(),
}));

vi.mock("@heroui/react", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  toast,
}));

vi.mock("@/services/apis", () => ({ addApi, updateApi }));

import SaveModal from "@/app/admin/components/apis/components/save-modal";

const CATEGORYS: Category[] = [
  {
    id: "cat-1",
    name: "随机生成",
    sort: 1,
    apis: [],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const API: Api = {
  id: "api-1",
  category_id: "cat-1",
  name: "随机头像",
  desc: "生成随机头像",
  path: "/api/random-avatar",
  method: "GET",
  operation_id: "getRandomAvatar",
  pinned: true,
  is_featured: false,
  call_count: 0,
  last_called: new Date("2026-01-01T00:00:00Z"),
  category: CATEGORYS[0],
  sort: 2,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function Harness({ initialValues }: { initialValues: Api | null }) {
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
      categorysList={CATEGORYS}
    />
  );
}

const renderModal = (initialValues: Api | null) =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <Harness initialValues={initialValues} />
    </SWRConfig>,
  );

const submit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(await screen.findByRole("button", { name: /确定|正在提交/ }));
};

/** 点开指定 Select 并选中某个选项（popover 渲染在 portal 里）
 * 触发按钮同时带 aria-label 与 aria-labelledby（后者优先），
 * 可访问名称是拼接文本，这里用正则包含匹配
 */
const selectOption = async (
  user: ReturnType<typeof userEvent.setup>,
  selectName: string,
  optionName: string,
) => {
  await user.click(await screen.findByRole("button", { name: new RegExp(selectName) }));
  const listbox = await screen.findByRole("listbox", { name: new RegExp(selectName) });
  await user.click(within(listbox).getByRole("option", { name: optionName }));
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
  addApi.mockReset();
  updateApi.mockReset();
  handleRefresh.mockClear();
  toast.success.mockClear();
  toast.danger.mockClear();
});

afterEach(cleanup);

describe("接口保存表单 - 必填与格式校验", () => {
  it("必填项为空时提交被拦截，不发起请求", async () => {
    const user = userEvent.setup();
    renderModal(null);

    await submit(user);

    expect(await screen.findByText("请输入接口名称")).toBeInTheDocument();
    expect(addApi).not.toHaveBeenCalled();
  });

  it("接口路径不以 / 开头时提交被拦截并提示", async () => {
    const user = userEvent.setup();
    renderModal(null);

    await user.type(screen.getByLabelText("接口名称"), "测试接口");
    await user.type(screen.getByLabelText("接口路径"), "api/no-slash");
    await user.type(screen.getByLabelText("operationId"), "getTest");
    await submit(user);

    expect(
      await screen.findByText("接口路径必须以 / 开头"),
    ).toBeInTheDocument();
    expect(addApi).not.toHaveBeenCalled();
  });
});

describe("接口保存表单 - 提交 payload", () => {
  it("新增模式：点开下拉选择分类与请求方式后提交，payload 形状正确", async () => {
    const user = userEvent.setup();
    addApi.mockResolvedValue({ code: 200, msg: "成功" });
    renderModal(null);

    await selectOption(user, "所属分类", "随机生成");
    await user.type(screen.getByLabelText("接口名称"), "新接口");
    await user.type(screen.getByLabelText("接口路径"), "/api/new");
    await user.type(screen.getByLabelText("operationId"), "getNew");
    await selectOption(user, "请求方式", "POST");
    await user.click(screen.getByText("置顶"));
    await user.type(screen.getByRole("textbox", { name: "排序" }), "5");
    await submit(user);

    await waitFor(() => {
      expect(addApi).toHaveBeenCalledTimes(1);
    });
    expect(addApi).toHaveBeenCalledWith({
      id: undefined,
      category_id: "cat-1",
      name: "新接口",
      desc: "",
      path: "/api/new",
      method: "POST",
      operation_id: "getNew",
      sort: 15, // 默认 1 + 追加输入 5
      pinned: true,
      is_featured: false,
    });
    expect(updateApi).not.toHaveBeenCalled();
  });

  it("编辑模式：字段预填、带 id 走 updateApi，勾选推荐生效", async () => {
    const user = userEvent.setup();
    updateApi.mockResolvedValue({ code: 200, msg: "成功" });
    renderModal(API);

    // 分类/请求方式由 initialValues 预填，无需交互
    await user.click(screen.getByText("推荐"));
    await submit(user);

    await waitFor(() => {
      expect(updateApi).toHaveBeenCalledTimes(1);
    });
    expect(updateApi).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "api-1",
        category_id: "cat-1",
        name: "随机头像",
        path: "/api/random-avatar",
        method: "GET",
        sort: 2,
        pinned: true,
        is_featured: true, // 原为 false，勾选后 true
      }),
    );
    expect(addApi).not.toHaveBeenCalled();
  });
});

describe("接口保存表单 - 提交后状态", () => {
  it("失败（code !== 200）：弹窗保持打开，按钮文案复位", async () => {
    const user = userEvent.setup();
    updateApi.mockResolvedValue({ code: 500, msg: "失败" });
    renderModal(API);

    await submit(user);

    await waitFor(() => {
      expect(updateApi).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByRole("button", { name: "确定" })).toBeInTheDocument();
    expect(screen.getByText("编辑接口")).toBeInTheDocument();
    expect(toast.success).not.toHaveBeenCalled();
    expect(handleRefresh).not.toHaveBeenCalled();
  });

  it("成功：toast + 刷新列表 + 弹窗关闭", async () => {
    const user = userEvent.setup();
    updateApi.mockResolvedValue({ code: 200, msg: "成功" });
    renderModal(API);

    await submit(user);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("提交成功", expect.anything());
      expect(handleRefresh).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.queryByText("编辑接口")).not.toBeInTheDocument();
    });
  });
});
