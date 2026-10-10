import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RESPONSE } from "@/enums";
import {
  dbErrorResponse,
  ilikeOr,
  randomTextResponse,
  textResponse,
} from "@/lib/server/api-helpers";

/** 最小可用的 supabase.rpc 假实现，只按脚本返回 { data, error } */
function fakeSupabase(
  result: { data: unknown; error: unknown } | (() => unknown),
) {
  return {
    rpc: vi.fn(async () =>
      typeof result === "function" ? result() : result,
    ),
  } as never;
}

async function readJson(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
    timestamp: number;
  };
}

describe("textResponse", () => {
  it("以 text/plain 直出正文，不套响应壳", async () => {
    const res = textResponse("要直出的文本");

    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("要直出的文本");
  });

  it("空字符串也按 text/plain 返回", async () => {
    const res = textResponse("");

    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("");
  });
});

describe("dbErrorResponse", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  // C1 的回归点：此前直接 responseMessage(null, error.message)，
  // 会把表名、列名、权限信息透给匿名调用方
  it("对外只返回固定文案，不泄露原始 error.message", async () => {
    const leaky = {
      message: 'relation "ea_license_plate" does not exist',
      code: "42P01",
      details: 'column "foo" does not exist',
    };

    const body = await readJson(dbErrorResponse(leaky, "ea_license_plate"));

    expect(body.msg).toBe("服务开小差，请稍后重试");
    expect(body.code).toBe(RESPONSE.ERROR);
    expect(body.data).toBeNull();
    expect(JSON.stringify(body)).not.toContain("ea_license_plate");
    expect(JSON.stringify(body)).not.toContain("42P01");
    expect(JSON.stringify(body)).not.toContain("does not exist");
  });

  it("原始错误改走服务端 console.error 留痕", () => {
    dbErrorResponse({ message: "内部细节" }, "label-x");

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0]?.[0]).toContain("label-x");
    expect(String(errorSpy.mock.calls[0]?.[1])).toContain("内部细节");
  });

  it("error 为 null / 无 message 时也不抛错", async () => {
    const body = await readJson(dbErrorResponse(null, "label"));

    expect(body.code).toBe(RESPONSE.ERROR);
    expect(body.msg).toBe("服务开小差，请稍后重试");
  });

  it("HTTP 状态码保持 200（业务错误码走 body 的 code）", () => {
    expect(dbErrorResponse({ message: "x" }, "l").status).toBe(200);
  });
});

describe("randomTextResponse", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("默认只输出 content 白名单字段", async () => {
    const supabase = fakeSupabase({
      data: { content: "一句文案", from: "隐藏字段", id: 99 },
      error: null,
    });

    const body = await readJson(
      await randomTextResponse(supabase, "get_random_x", null),
    );

    expect(body.code).toBe(RESPONSE.SUCCESS);
    expect(body.data).toEqual({ content: "一句文案" });
  });

  it("fields 可自定义输出字段", async () => {
    const supabase = fakeSupabase({
      data: { content: "c", author: "a" },
      error: null,
    });

    const body = await readJson(
      await randomTextResponse(supabase, "rpc", null, { fields: ["author"] }),
    );

    expect(body.data).toEqual({ author: "a" });
  });

  it("RPC 入参原样透传", async () => {
    const supabase = fakeSupabase({ data: { content: "c" }, error: null });

    await randomTextResponse(supabase, "rpc", null, {
      params: { types: ["a"], minlength: 10 },
    });

    expect(supabase.rpc).toHaveBeenCalledWith("rpc", {
      types: ["a"],
      minlength: 10,
    });
  });

  it("format=text 时直出纯文本", async () => {
    const supabase = fakeSupabase({ data: { content: "纯文本内容" }, error: null });
    const res = await randomTextResponse(supabase, "rpc", "text");

    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("纯文本内容");
  });

  it("format 取其它值时按 JSON 处理", async () => {
    const supabase = fakeSupabase({ data: { content: "c" }, error: null });
    const res = await randomTextResponse(supabase, "rpc", "json");

    expect(res.headers.get("Content-Type")).toContain("application/json");
  });

  // C3 的回归点：判据从 !data?.content 改为 typeof data.content !== "string"
  it("content 为空字符串是合法数据，不报「暂无数据」", async () => {
    const supabase = fakeSupabase({ data: { content: "" }, error: null });

    const body = await readJson(await randomTextResponse(supabase, "rpc", null));

    expect(body.code).toBe(RESPONSE.SUCCESS);
    expect(body.data).toEqual({ content: "" });
  });

  it("content 为空字符串时 format=text 直出空正文", async () => {
    const supabase = fakeSupabase({ data: { content: "" }, error: null });
    const res = await randomTextResponse(supabase, "rpc", "text");

    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("");
  });

  it("RPC 无返回（data 为 null）时报「暂无数据」", async () => {
    const supabase = fakeSupabase({ data: null, error: null });

    const body = await readJson(await randomTextResponse(supabase, "rpc", null));

    expect(body.code).toBe(RESPONSE.ERROR);
    expect(body.msg).toBe("暂无数据");
    expect(body.data).toBeNull();
  });

  it("RPC 返回数组（无 content 字段）时报「暂无数据」", async () => {
    const supabase = fakeSupabase({ data: [], error: null });

    const body = await readJson(await randomTextResponse(supabase, "rpc", null));

    expect(body.code).toBe(RESPONSE.ERROR);
    expect(body.msg).toBe("暂无数据");
  });

  it("RPC 报错时走 dbErrorResponse，不泄露原文", async () => {
    const supabase = fakeSupabase({
      data: null,
      error: { message: 'relation "ea_hitokoto" does not exist' },
    });

    const body = await readJson(await randomTextResponse(supabase, "rpc", null));

    expect(body.code).toBe(RESPONSE.ERROR);
    expect(body.msg).toBe("服务开小差，请稍后重试");
    expect(JSON.stringify(body)).not.toContain("ea_hitokoto");
  });
});

describe("ilikeOr", () => {
  it("按列生成 or() 多列 ilike 过滤串", () => {
    expect(ilikeOr("粤", ["province", "city"])).toBe(
      "province.ilike.%粤%,city.ilike.%粤%",
    );
  });

  it("单列时不带逗号", () => {
    expect(ilikeOr("abc", ["name"])).toBe("name.ilike.%abc%");
  });

  // B5 的回归点：ilikeOr 自身不判空，纯标点关键字净化后是空串，
  // 拼出的 %% 会匹配全表。路由层必须在净化后复查空串（见下方用例）
  it("纯标点关键字会生成 %% —— 因此路由必须自己拦住空串", () => {
    expect(ilikeOr(",", ["province", "city"])).toBe(
      "province.ilike.%%,city.ilike.%%",
    );
  });

  it("PostgREST or() 语法字符不会穿透到过滤串里", () => {
    const built = ilikeOr('a,b(c)"d', ["name"]);

    // 逗号被删除后不会再被当成 or() 的分隔符
    expect(built).toBe("name.ilike.%abcd%");
  });

  it("LIKE 通配符被转义为字面量", () => {
    expect(ilikeOr("100%", ["name"])).toBe("name.ilike.%100\\%%");
    expect(ilikeOr("a_b", ["name"])).toBe("name.ilike.%a\\_b%");
  });

  it("空列数组返回空串", () => {
    expect(ilikeOr("x", [])).toBe("");
  });
});
