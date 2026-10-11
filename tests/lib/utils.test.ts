import { describe, expect, it } from "vitest";

import { RESPONSE } from "@/enums";
import {
  buildYearOptions,
  catchError,
  clamp,
  get,
  get4kUrl,
  getUrl,
  isSuccess,
  parseBoundedInt,
  pick,
  pickFields,
  responseMessage,
  sanitizeLikeKeyword,
} from "@/lib/utils";

describe("responseMessage / isSuccess", () => {
  it("默认按成功组装统一返回体", () => {
    const r = responseMessage({ a: 1 });

    expect(r.data).toEqual({ a: 1 });
    expect(r.code).toBe(RESPONSE.SUCCESS);
    expect(r.msg).toBe(RESPONSE.label(RESPONSE.SUCCESS));
    expect(typeof r.timestamp).toBe("number");
  });

  it("显式 code/msg 时透传，失败时 data 为 null", () => {
    const r = responseMessage(null, "参数错误", RESPONSE.ERROR);

    expect(r.data).toBeNull();
    expect(r.code).toBe(RESPONSE.ERROR);
    expect(r.msg).toBe("参数错误");
  });

  it("isSuccess 只认 200", () => {
    expect(isSuccess(RESPONSE.SUCCESS)).toBe(true);
    expect(isSuccess(RESPONSE.ERROR)).toBe(false);
    expect(isSuccess(RESPONSE.DUPLICATE)).toBe(false);
    expect(isSuccess(undefined)).toBe(false);
  });
});

describe("catchError", () => {
  it("Error 取 message，字符串原样，其余归为未知错误", () => {
    expect(catchError(new Error("boom")).msg).toBe("boom");
    expect(catchError("plain string").msg).toBe("plain string");
    expect(catchError({ nope: 1 }).msg).toBe("未知错误");
    expect(catchError(null).msg).toBe("未知错误");
  });

  it("固定返回 code 500", () => {
    expect(catchError(new Error("x")).code).toBe(RESPONSE.ERROR);
  });
});

describe("sanitizeLikeKeyword", () => {
  it("转义 LIKE 通配符，防止通配符注入", () => {
    expect(sanitizeLikeKeyword("100%")).toBe("100\\%");
    expect(sanitizeLikeKeyword("a_b")).toBe("a\\_b");
  });

  // B5 的回归点：路由层用「净化后是否为空串」拦截纯标点输入，
  // 否则 `xx.ilike.%%` 会匹配全表
  it("删掉 PostgREST or() 语法字符，纯净标点输入净化后为空", () => {
    expect(sanitizeLikeKeyword(",")).toBe("");
    expect(sanitizeLikeKeyword("()")).toBe("");
    expect(sanitizeLikeKeyword('"')).toBe("");
    expect(sanitizeLikeKeyword("\\")).toBe("");
    expect(sanitizeLikeKeyword(",()\"\\")).toBe("");
  });

  it("混合输入时只删语法字符，不动其它内容", () => {
    expect(sanitizeLikeKeyword("a,b(c)")).toBe("abc");
    expect(sanitizeLikeKeyword("粤A")).toBe("粤A");
    // 顺序是先删 , ( ) " \ 再转义 % _
    expect(sanitizeLikeKeyword("a,%")).toBe("a\\%");
  });
});

describe("pickFields", () => {
  const allowed = ["name", "sort"] as const;

  it("只保留白名单字段", () => {
    expect(
      pickFields({ name: "x", sort: 1, id: "evil", call_count: 999 }, allowed),
    ).toEqual({ name: "x", sort: 1 });
  });

  it("非对象入参返回空对象，不抛错", () => {
    expect(pickFields(null, allowed)).toEqual({});
    expect(pickFields(undefined, allowed)).toEqual({});
    expect(pickFields("str", allowed)).toEqual({});
    expect(pickFields(42, allowed)).toEqual({});
  });

  it("白名单为空时全部过滤掉", () => {
    expect(pickFields({ name: "x" }, [])).toEqual({});
  });
});

describe("get", () => {
  const fixture = {
    user: { name: "n", tags: ["a", "b"] },
    list: [{ id: 1 }, { id: 2 }],
    zero: 0,
    empty: "",
    nil: null,
  };

  it("支持点号、数组下标与混合路径", () => {
    expect(get(fixture, "user.name")).toBe("n");
    expect(get(fixture, "user.tags[1]")).toBe("b");
    expect(get(fixture, "list[0].id")).toBe(1);
  });

  it("路径不存在时回退默认值", () => {
    expect(get(fixture, "user.missing", "--")).toBe("--");
    expect(get(fixture, "a.b.c.d", "--")).toBe("--");
  });

  // 这类「假值」是 lodash.get 最容易踩的坑：不能因为 0/"" 就返回默认值
  it("假值（0 / 空串）不被误判为缺失", () => {
    expect(get(fixture, "zero", 99)).toBe(0);
    expect(get(fixture, "empty", "x")).toBe("");
  });

  it("null 立即短路为默认值，不继续下钻", () => {
    expect(get(fixture, "nil.anything", "d")).toBe("d");
    expect(get(fixture, "nil", "d")).toBeNull();
  });

  it("整条入参不是对象时系列", () => {
    expect(get(null, "a", "d")).toBe("d");
    expect(get(undefined, "a", "d")).toBe("d");
    // 字符串也能按 key 取值 —— "s".length === 1
    expect(get("s", "length", 0)).toBe(1);
    expect(get("s", "0", "d")).toBe("s");
  });
});

describe("pick", () => {
  it("按 key 列表挑选，src 上没有的 key 不会出现在结果里", () => {
    const src = { a: 1, b: 2 };

    // @ts-expect-error 故意传一个不存在的 key，验证运行时不注入该字段
    expect(pick(src, ["a", "c"])).toEqual({ a: 1 });
  });

  it("falsy 入参返回空对象", () => {
    expect(pick(null as never, ["a"])).toEqual({});
    expect(pick(undefined as never, ["a"])).toEqual({});
  });
});

describe("clamp", () => {
  it("钳制到 [min, max]", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(50, 0, 10)).toBe(10);
  });

  it("默认 min 为 0，max 为 MAX_SAFE_INTEGER", () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
  });

  // B2 的回归点：clamp(NaN) 仍是 NaN，
  // 这就是 random-avatar 原先产出 width="NaN" 的原因
  it("NaN 会原样穿透 clamp —— 这正是不该用它兜 parseInt 的原因", () => {
    expect(Number.isNaN(clamp(Number.parseInt("abc"), 1, 20))).toBe(true);
  });
});

describe("parseBoundedInt", () => {
  it("按边界钳制", () => {
    expect(parseBoundedInt("5", 1, 1, 100)).toBe(5);
    expect(parseBoundedInt("0", 1, 1, 100)).toBe(1);
    expect(parseBoundedInt("200", 1, 1, 100)).toBe(100);
  });

  // B1/B2 的回归点：此前用 parseInt + Math.max/Math.min，
  // 非数字会得到 NaN 并一路透传给下游库。
  // 签名只接 string | null，正好是 searchParams.get() 的返回类型
  it("非数字与空值回退到 fallback，不产生 NaN", () => {
    expect(parseBoundedInt("abc", 16, 1, 100)).toBe(16);
    expect(parseBoundedInt("", 16, 1, 100)).toBe(16);
    expect(parseBoundedInt(null, 16, 1, 100)).toBe(16);
    expect(Number.isNaN(parseBoundedInt("xyz", 0, 1, 20))).toBe(false);
  });

  it("负数、小数与 parse 截断行为", () => {
    expect(parseBoundedInt("-5", 3, 1, 100)).toBe(1);
    expect(parseBoundedInt("3.7", 1, 1, 100)).toBe(3);
    // parseInt 遇到非数字字符即截断：parseInt("1e3") === 1
    // 可接受——最坏是取到偏小的值，再被 min 兜住，不会得到 NaN
    expect(parseBoundedInt("1e3", 1, 1, 100)).toBe(1);
    expect(parseBoundedInt(" 42 ", 1, 1, 100)).toBe(42);
    expect(parseBoundedInt("64px", 1, 1, 100)).toBe(64);
  });

  it("fallback 本身不在 [min,max] 内时也原样返回（调用方保证）", () => {
    expect(parseBoundedInt("abc", 9999, 1, 100)).toBe(9999);
  });
});

describe("buildYearOptions", () => {
  it("生成当年到起始年的倒序选项", () => {
    const opts = buildYearOptions(2002, 2004);

    expect(opts).toEqual([
      { value: 2004, label: "2004年" },
      { value: 2003, label: "2003年" },
      { value: 2002, label: "2002年" },
    ]);
  });

  it("不传 currentYear 时用当前年", () => {
    const thisYear = new Date().getFullYear();
    const opts = buildYearOptions(thisYear - 1);

    expect(opts[0]?.value).toBe(thisYear);
    expect(opts).toHaveLength(2);
  });

  it("起始年晚于当前年时返回空数组，不产生负长度", () => {
    expect(buildYearOptions(2030, 2020)).toEqual([]);
  });

  it("起始年等于当前年时只返回一年", () => {
    expect(buildYearOptions(2026, 2026)).toEqual([
      { value: 2026, label: "2026年" },
    ]);
  });
});

describe("getUrl / get4kUrl", () => {
  // Bing HPImageArchive 实际返回的 url 形如
  // /th?id=OHR.XXX&rf=...，本身不带尺寸后缀；尺寸由这两个函数追加。
  // 带数字尺寸后缀的 url 是「传入历史版本」的情况，函数会先剥掉再拼。
  const numeric = "https://cn.bing.com/th?id=OHR.Test_ZH-CN123_1920x1080.jpg";

  it("从 id 推导 1080p 地址", () => {
    expect(getUrl(numeric)).toBe(
      "https://bing.com/th?id=OHR.Test_ZH-CN123_1920x1080.jpg",
    );
  });

  it("从 id 推导 UHD 地址", () => {
    expect(get4kUrl(numeric)).toBe(
      "https://bing.com/th?id=OHR.Test_ZH-CN123_UHD.jpg",
    );
  });

  it("不带尺寸后缀的裸 id 直接拼接", () => {
    const bare = "https://cn.bing.com/th?id=OHR.Bare";

    expect(getUrl(bare)).toBe("https://bing.com/th?id=OHR.Bare_1920x1080.jpg");
    expect(get4kUrl(bare)).toBe("https://bing.com/th?id=OHR.Bare_UHD.jpg");
  });

  // C9 修复点：剥离正则同时认 _数字x数字 与 _UHD，
  // 输入已带尺寸后缀时只剥一次再拼，不会出现二次拼接的坏地址
  it("输入已带 _UHD 时先剥离再拼接，不重复叠加后缀", () => {
    const uhd = "https://cn.bing.com/th?id=OHR.Test_ZH-CN123_UHD.jpg";

    expect(getUrl(uhd)).toBe(
      "https://bing.com/th?id=OHR.Test_ZH-CN123_1920x1080.jpg",
    );
    expect(get4kUrl(uhd)).toBe(
      "https://bing.com/th?id=OHR.Test_ZH-CN123_UHD.jpg",
    );
  });

  it("输入已带数字尺寸后缀时先剥离再拼接", () => {
    expect(getUrl(numeric)).toBe(
      "https://bing.com/th?id=OHR.Test_ZH-CN123_1920x1080.jpg",
    );
    expect(get4kUrl(numeric)).toBe(
      "https://bing.com/th?id=OHR.Test_ZH-CN123_UHD.jpg",
    );
  });

  // C9 的兜底：getBingWallpaper 在返回前已校验地址可解析，
  // 所以正常调用链路上不会走到这里；仍显式抛出，避免坏 url 被静默拼出来
  it("非法 url 会抛错（调用方需自行防护）", () => {
    expect(() => getUrl("not-a-url")).toThrow();
  });
});
