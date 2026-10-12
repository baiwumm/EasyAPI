// @vitest-environment jsdom
/*
 * JsonContent 的 SWR key 行为（T2，对应 backlog D2 的核心语义）：
 * 1. 改参数（未提交）不请求
 * 2. 点「查询」提交后才请求（key 变化触发）
 * 3. 参数没变时点「查询」走 mutate() 手动刷新
 */
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useState } from "react";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getApiData } = vi.hoisted(() => ({ getApiData: vi.fn() }));

vi.mock("@/services/common", () => ({ getApiData }));
vi.mock("next/navigation", () => ({ usePathname: () => "/api/echo" }));

import JsonContent from "@/components/JsonContent";

/** 带「改参数」按钮的 harness：模拟父页面输入框本地 state 变化（未提交） */
function Harness() {
  const [live, setLive] = useState<Record<string, unknown>>({ q: "a" });

  return (
    <>
      <button onClick={() => setLive({ q: "b" })} type="button">
        改参数
      </button>
      <JsonContent
        getColumns={(data: { content: string }) => [
          { label: "内容", children: String(data.content) },
        ]}
        onRefresh={() => true}
        params={live}
        searchText="查询"
        title="回显测试"
      >
        <input aria-label="占位输入" />
      </JsonContent>
    </>
  );
}

const renderJson = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <Harness />
    </SWRConfig>,
  );

/** 挂载后等待首个请求与渲染完成 */
const findCell = (text: string) =>
  screen.findByText(text, undefined, { timeout: 5000 });

beforeEach(() => {
  getApiData.mockReset();
  getApiData.mockImplementation(async (_path: string, params: Record<string, unknown>) => ({
    code: 200,
    msg: "成功",
    data: { content: `content-${params.q}` },
    timestamp: 0,
  }));
});

afterEach(cleanup);

describe("JsonContent SWR key 行为", () => {
  it("挂载即用已提交参数请求一次", async () => {
    renderJson();

    expect(await findCell("content-a")).toBeInTheDocument();
    expect(getApiData).toHaveBeenCalledTimes(1);
    expect(getApiData).toHaveBeenCalledWith("/api/echo", { q: "a" });
  });

  it("改参数（未提交）不请求，展示仍是旧数据", async () => {
    const user = userEvent.setup();
    renderJson();
    await findCell("content-a");
    expect(getApiData).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText("改参数"));
    // 给可能的意外请求留一个事件循环的窗口
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(getApiData).toHaveBeenCalledTimes(1);
    expect(screen.getByText("content-a")).toBeInTheDocument();
  });

  it("点「查询」提交后 key 变化触发请求，展示新数据", async () => {
    const user = userEvent.setup();
    renderJson();
    await findCell("content-a");

    await user.click(screen.getByText("改参数"));
    await user.click(screen.getByRole("button", { name: /查询/ }));

    expect(await findCell("content-b")).toBeInTheDocument();
    expect(getApiData).toHaveBeenCalledTimes(2);
    expect(getApiData).toHaveBeenLastCalledWith("/api/echo", { q: "b" });
  });

  it("参数没变时点「查询」走 mutate() 手动刷新（key 不变仍重发）", async () => {
    const user = userEvent.setup();
    renderJson();
    await findCell("content-a");

    await user.click(screen.getByRole("button", { name: /查询/ }));
    await user.click(screen.getByRole("button", { name: /查询/ }));

    // key 未变，但两次点击各发一次（第二次走 mutate）
    await waitForCount(3);
    expect(getApiData).toHaveBeenLastCalledWith("/api/echo", { q: "a" });
  });
});

/** 轮询等待 fetch 次数到位（SWR 请求是异步链） */
async function waitForCount(count: number) {
  await vi.waitFor(() => {
    expect(getApiData).toHaveBeenCalledTimes(count);
  });
}
