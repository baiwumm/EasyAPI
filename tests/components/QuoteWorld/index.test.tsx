// @vitest-environment jsdom
/*
 * QuoteWorld 的 SWR key 行为（T2）：九页共用的文案页模板。
 * 用 poetry 模式驱动：作者输入框是「本地参数」，吟诗一首是「提交」。
 * 1. 改作者不请求；2. 点「吟诗一首」才请求；3. 参数没变走 mutate()。
 */
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getApiData } = vi.hoisted(() => ({ getApiData: vi.fn() }));

vi.mock("@/services/common", () => ({ getApiData }));
vi.mock("next/navigation", () => ({ usePathname: () => "/api/poetry" }));

import QuoteWorld from "@/components/QuoteWorld";

const renderQuote = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <QuoteWorld mode="poetry" title="今日诗词" />
    </SWRConfig>,
  );

/** 打字动画逐字显示，等待文案片段出现
 * 限定叶子元素：textContent 会向上冒泡，不限定会命中所有祖先
 */
const findQuoteText = (text: string) =>
  screen.findByText(
    (_, element) =>
      element?.childElementCount === 0 &&
      (element?.textContent ?? "").includes(text),
    undefined,
    { timeout: 5000 },
  );

beforeEach(() => {
  getApiData.mockReset();
  let call = 0;
  getApiData.mockImplementation(async (_path: string, params: Record<string, unknown>) => ({
    code: 200,
    msg: "成功",
    call: (call += 1),
    data: [
      {
        author: String(params.author),
        paragraphs: [`诗句-${String(params.author)}`],
        title: "测试诗",
      },
    ],
    timestamp: 0,
  }));
});

afterEach(cleanup);

describe("QuoteWorld SWR key 行为（poetry 模式）", () => {
  it("挂载即用默认作者请求一次并渲染段落", async () => {
    renderQuote();

    await expect(findQuoteText("诗句-李白")).resolves.toBeInTheDocument();
    expect(getApiData).toHaveBeenCalledTimes(1);
    expect(getApiData).toHaveBeenCalledWith("/api/poetry", { author: "李白" });
  });

  it("改作者（未提交）不请求，点「吟诗一首」才请求新作者", async () => {
    const user = userEvent.setup();
    renderQuote();
    await findQuoteText("诗句-李白");

    const authorInput = screen.getByRole("textbox", { name: "作者" });
    // 默认值是「李白」，先清空再输入
    await user.clear(authorInput);
    await user.type(authorInput, "杜甫");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(getApiData).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /吟诗一首/ }));

    await expect(findQuoteText("诗句-杜甫")).resolves.toBeInTheDocument();
    expect(getApiData).toHaveBeenCalledTimes(2);
    expect(getApiData).toHaveBeenLastCalledWith("/api/poetry", { author: "杜甫" });
  });

  it("作者没变时点「吟诗一首」走 mutate() 重发请求", async () => {
    const user = userEvent.setup();
    renderQuote();
    await findQuoteText("诗句-李白");

    await user.click(screen.getByRole("button", { name: /吟诗一首/ }));

    await vi.waitFor(() => {
      expect(getApiData).toHaveBeenCalledTimes(2);
    });
    expect(getApiData).toHaveBeenLastCalledWith("/api/poetry", { author: "李白" });
  });
});
