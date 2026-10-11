import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// JsBarcode 会在收到的 options 上补 text 等键（src/JsBarcode.js 第 70 行），
// 所以入参先快照再执行真实实现，断言才不会混进库自己写入的键
const { received } = vi.hoisted(() => ({
  received: [] as {
    text: unknown;
    options: Record<string, unknown>;
  }[],
}));

type JsBarcodeImpl = (element: Element, text: string, options: unknown) => void;

// 包一层 spy 但保留真实实现：既能拿到「到底传了哪些选项给 JsBarcode」，
// 又能让 SVG/PNG 真的渲染出来，不必为两条输出路径分别造桩
vi.mock("jsbarcode", async (importOriginal) => {
  // jsbarcode 是 export = 形式的 CJS，importOriginal 运行时给出 { default: fn }，
  // 而类型上 import("jsbarcode") 本身就是函数，所以这里显式按命名空间取 default
  const { default: impl } = (await importOriginal()) as unknown as {
    default: JsBarcodeImpl;
  };

  return {
    default: vi.fn((element: Element, text: string, options: unknown) => {
      received.push({ text, options: { ...(options as object) } });
      impl(element, text, options);
    }),
  };
});

import { GET } from "@/app/api/barcode/route";

// 路由 handler 读的是 nextUrl.searchParams，必须用 NextRequest 而非裸 Request
const req = (query: string) => new NextRequest(`http://x/api/barcode?${query}`);

/** JSON 响应壳 */
async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
    timestamp: number;
  };
}

/** 取 JsBarcode 最近一次收到的 options，用于断言白名单是否生效 */
function lastOptions(): Record<string, unknown> {
  return received.at(-1)?.options ?? {};
}

/** 取 JsBarcode 最近一次收到的条码内容 */
function lastText(): unknown {
  return received.at(-1)?.text;
}

describe("GET /api/barcode 参数校验", () => {
  beforeEach(() => {
    received.length = 0;
  });

  it("缺少 text 时返回 code=500，不生成图片", async () => {
    const b = await body(await GET(req("type=svg&format=CODE128")));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("缺少 text 参数");
    expect(b.data).toBeNull();
    expect(received).toHaveLength(0);
  });

  it("text 超长时拒绝并给出上限", async () => {
    const b = await body(
      await GET(req(`text=${"a".repeat(201)}&type=svg&format=CODE128`)),
    );

    expect(b.code).toBe(500);
    expect(b.msg).toContain("200");
    expect(received).toHaveLength(0);
  });

  it("format 不在枚举内时拒绝", async () => {
    const b = await body(await GET(req("text=abc&type=svg&format=NOPE")));

    expect(b.code).toBe(500);
    expect(b.msg).toContain("format");
    expect(received).toHaveLength(0);
  });

  it("type 只支持 svg/png", async () => {
    const b = await body(await GET(req("text=abc&type=gif&format=CODE128")));

    expect(b.code).toBe(500);
    expect(received).toHaveLength(0);
  });
});

// C10：此前把 rest 原样直传 JsBarcode，只有数值被钳制，键完全没过滤
describe("GET /api/barcode JsBarcode 选项白名单", () => {
  beforeEach(() => {
    received.length = 0;
  });

  it("登记过的数值项透传，并钳制在 0 ~ 500", async () => {
    await GET(
      req("text=abc&type=svg&format=CODE128&width=99999&margin=10&height=-5"),
    );

    expect(lastOptions()).toMatchObject({
      width: 500,
      margin: 10,
      height: 0,
    });
  });

  it("数值项给非数字时丢弃该键，走 JsBarcode 默认值", async () => {
    await GET(req("text=abc&type=svg&format=CODE128&width=abc&margin=1e"));

    expect(lastOptions()).not.toHaveProperty("width");
    expect(lastOptions()).not.toHaveProperty("margin");
  });

  it("未登记的查询参数一律不透传给 JsBarcode", async () => {
    await GET(
      req("text=abc&type=svg&format=CODE128&valid=1&callback=x&foo=bar&flat=1"),
    );

    // flat 虽不是文档登记项，但 jsbarcode 的 BaseOptions 里有它，仍属白名单
    expect(Object.keys(lastOptions()).sort()).toEqual([
      "flat",
      "format",
      "xmlDocument",
    ]);
    expect(lastText()).toBe("abc");
  });

  it("查询参数里的 text 同名键不会混进 options（只有位置参数一个来源）", async () => {
    await GET(req("text=abc&type=svg&format=CODE128"));

    // options 上只有 format 与内部 xmlDocument，没有第二个 text 键
    expect(Object.keys(lastOptions()).sort()).toEqual(["format", "xmlDocument"]);
    expect(lastText()).toBe("abc");
  });

  it("displayValue=false 解析为 false，不再被当成真值", async () => {
    await GET(req("text=abc&type=svg&format=CODE128&displayValue=false"));
    expect(lastOptions()).toMatchObject({ displayValue: false });

    await GET(req("text=abc&type=svg&format=CODE128&displayValue=true"));
    expect(lastOptions()).toMatchObject({ displayValue: true });
  });

  it("颜色只放行十六进制与少量关键字", async () => {
    await GET(
      req("text=abc&type=svg&format=CODE128&lineColor=%23ff0000&background=white"),
    );
    expect(lastOptions()).toMatchObject({
      lineColor: "#ff0000",
      background: "white",
    });

    await GET(req("text=abc&type=svg&format=CODE128&lineColor=not-a-color"));
    expect(lastOptions()).not.toHaveProperty("lineColor");
  });

  it("枚举项（textAlign/textPosition/fontOptions）只放行文档值", async () => {
    await GET(
      req(
        "text=abc&type=svg&format=CODE128&textAlign=left&textPosition=top&fontOptions=bold",
      ),
    );
    expect(lastOptions()).toMatchObject({
      textAlign: "left",
      textPosition: "top",
      fontOptions: "bold",
    });

    await GET(
      req("text=abc&type=svg&format=CODE128&textAlign=middle&textPosition=nowhere"),
    );
    expect(lastOptions()).not.toHaveProperty("textAlign");
    expect(lastOptions()).not.toHaveProperty("textPosition");
  });

  it("font 超长时丢弃", async () => {
    await GET(req(`text=abc&type=svg&format=CODE128&font=${"a".repeat(65)}`));
    expect(lastOptions()).not.toHaveProperty("font");

    await GET(req("text=abc&type=svg&format=CODE128&font=monospace"));
    expect(lastOptions()).toMatchObject({ font: "monospace" });
  });

  it("空值参数被丢弃，不影响默认渲染", async () => {
    await GET(req("text=abc&type=svg&format=CODE128&width=&margin="));

    expect(lastOptions()).not.toHaveProperty("width");
    expect(lastOptions()).not.toHaveProperty("margin");
  });
});

describe("GET /api/barcode 输出", () => {
  beforeEach(() => {
    received.length = 0;
  });

  it("type=svg 返回 image/svg+xml", async () => {
    const res = await GET(req("text=HELLO123456&type=svg&format=CODE128"));

    expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(await res.text()).toContain("<svg");
  });

  it("type=png 返回 image/png", async () => {
    const res = await GET(req("text=HELLO123456&type=png&format=CODE128"));

    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect((await res.arrayBuffer()).byteLength).toBeGreaterThan(0);
  });

  // F5：text 很长且 width 顶上限时，SVG 声明尺寸会有几十万，
  // 不拦住的话 sharp 会抛 "Input image exceeds pixel limit" 这种内部原文
  it("type=png 的超大尺寸被提前拦下，返回可读文案且不透出 sharp 原文", async () => {
    const res = await GET(
      req(
        `text=${"A".repeat(200)}&type=png&format=CODE128&width=500&height=500`,
      ),
    );

    const b = await body(res);

    expect(b.code).toBe(500);
    expect(b.msg).toContain("条码尺寸过大");
    expect(b.msg).not.toContain("pixel limit");
  });

  it("type=png 的正常尺寸不受影响", async () => {
    const res = await GET(
      req("text=HELLO123456&type=png&format=CODE128&width=2&height=100"),
    );

    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect((await res.arrayBuffer()).byteLength).toBeGreaterThan(0);
  });
});
