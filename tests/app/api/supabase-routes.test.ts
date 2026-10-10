import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { GET as licensePlate } from "@/app/api/license-plate/route";
import { GET as countryCode } from "@/app/api/country-code/route";
import { GET as postalCode } from "@/app/api/postal-code/route";
import { GET as chinesePoetry } from "@/app/api/chinese-poetry/route";
import { GET as riddle } from "@/app/api/riddle/route";
import { GET as hitokoto } from "@/app/api/hitokoto/route";

// ---- supabase server client 的假实现 ----
// 路由里两种调用形态都要支持：
//   1) supabase.from(t).select(c).or(x).limit(n)          —— 字典表查询
//   2) supabase.from(t).select(c).eq(k,v).limit(1).single()
//   3) supabase.rpc(name, params)
// 链式对象自身要可 await（带 then），否则解构 { data, error } 拿不到值
const { supabase } = vi.hoisted(() => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: async () => supabase,
}));

/** 造一条链式查询，最终 resolve 到 result */
function chain(result: { data: unknown; error: unknown }) {
  const api: Record<string, unknown> = {
    select: vi.fn(() => api),
    or: vi.fn(() => api),
    eq: vi.fn(() => api),
    limit: vi.fn(() => api),
    single: vi.fn(() => api),
    then: (resolve: (v: unknown) => void) => resolve(result),
  };

  return api;
}

/** 让 from() 返回链式查询 */
function fromReturns(result: { data: unknown; error: unknown }) {
  supabase.from.mockReturnValue(chain(result));
}

/** 让 rpc() resolve 到 result */
function rpcReturns(result: { data: unknown; error: unknown }) {
  supabase.rpc.mockResolvedValue(result);
}

const req = (url: string) => new NextRequest(url);

async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
  };
}

/** 把「表名/列名/permission」这类内部信息收集起来，用于断言不外泄 */
const INTERNAL = [
  "ea_license_plate",
  "ea_country_code",
  "ea_postal_code",
  "ea_hitokoto",
  "42P01",
  "permission denied",
  "does not exist",
];

beforeEach(() => {
  supabase.from.mockReset();
  supabase.rpc.mockReset();
});

// =====================================================================
// B5：keyword 净化绕过 —— 修前 ?keyword=, 会生成 %% 匹配全表
// =====================================================================
describe("B5 纯标点 keyword 不再拖全表", () => {
  const punctCases = [
    { label: "单个逗号", raw: "," },
    { label: "空括号", raw: "()" },
    { label: "引号", raw: '"' },
    { label: "反斜杠", raw: "\\" },
    { label: "混合标点", raw: ',()"\\' },
  ];

  for (const route of [
    { name: "license-plate", fn: licensePlate },
    { name: "country-code", fn: countryCode },
  ]) {
    for (const { label, raw } of punctCases) {
      it(`${route.name}: ${label} 直接拒绝，且完全不查数据库`, async () => {
        const res = await route.fn(
          req(
            `http://x/api/${route.name}?keyword=${encodeURIComponent(raw)}`,
          ),
        );
        const b = await body(res);

        expect(b.code).toBe(500);
        expect(b.msg).toBe("请输入有效的查询关键字");
        expect(b.data).toBeNull();
        // 关键：净化后被识别为空串，在创建 client 之前就返回，
        // 一次数据库往返都不该发生
        expect(supabase.from).not.toHaveBeenCalled();
      });
    }
  }

  it("postal-code: 纯标点同样被拒且不查库", async () => {
    const res = await postalCode(
      req(`http://x/api/postal-code?keyword=${encodeURIComponent(",")}&type=2`),
    );

    expect((await body(res)).msg).toBe("请输入有效的查询关键字");
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("三个路由：keyword 缺失时报「请输入查询关键字」", async () => {
    for (const fn of [licensePlate, countryCode, postalCode]) {
      const b = await body(await fn(req("http://x/api/x")));

      expect(b.msg).toBe("请输入查询关键字");
    }
  });
});

// =====================================================================
// limit 兜底：避免未命中索引时拉全表
// =====================================================================
describe("字典表查询带 limit", () => {
  it("license-plate limit(50)", async () => {
    fromReturns({ data: [], error: null });
    await licensePlate(req("http://x/api/license-plate?keyword=%E7%B2%A4"));

    const api = supabase.from.mock.results[0]?.value;

    expect((api?.limit as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(50);
  });

  it("country-code limit(50)", async () => {
    fromReturns({ data: [], error: null });
    await countryCode(req("http://x/api/country-code?keyword=%E4%B8%AD"));

    const api = supabase.from.mock.results[0]?.value;

    expect((api?.limit as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(50);
  });

  it("postal-code 按地区查 limit(20)", async () => {
    fromReturns({ data: [], error: null });
    await postalCode(
      req("http://x/api/postal-code?keyword=%E5%B9%BF&type=2"),
    );

    const api = supabase.from.mock.results[0]?.value;

    expect((api?.limit as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(20);
  });
});

// =====================================================================
// C1：数据库错误原文不外泄
// =====================================================================
describe("C1 数据库错误不对外泄露", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  for (const route of [
    { name: "license-plate", fn: licensePlate, url: "?keyword=%E7%B2%A4" },
    { name: "country-code", fn: countryCode, url: "?keyword=%E4%B8%AD" },
    { name: "chinese-poetry", fn: chinesePoetry, url: "" },
    { name: "riddle", fn: riddle, url: "" },
    { name: "hitokoto", fn: hitokoto, url: "" },
  ]) {
    it(`${route.name}: 报错只回固定文案`, async () => {
      supabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'relation "ea_x" does not exist', code: "42P01" },
      });
      supabase.from.mockReturnValue(
        chain({ data: null, error: { message: "permission denied for table ea_x" } }),
      );

      const raw = JSON.stringify(
        await body(await route.fn(req(`http://x/api/${route.name}${route.url}`))),
      );

      expect(raw).not.toContain("ea_x");
      for (const leak of INTERNAL) {
        expect(raw).not.toContain(leak);
      }
      expect(errorSpy).toHaveBeenCalled();
    });
  }
});

// =====================================================================
// 正常路径
// =====================================================================
describe("license-plate / country-code 正常查询", () => {
  it("命中时返回数据并带缓存头", async () => {
    fromReturns({
      data: [{ province: "广东省", city: "广州市", code: ["粤"], prefix: "A" }],
      error: null,
    });

    const res = await licensePlate(req("http://x/api/license-plate?keyword=%E7%B2%A4"));
    const b = await body(res);

    expect(b.code).toBe(200);
    expect(b.data).toHaveLength(1);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=3600, stale-while-revalidate=86400",
    );
  });

  it("未命中时返回空数组（不是错误）", async () => {
    fromReturns({ data: [], error: null });

    const b = await body(
      await countryCode(req("http://x/api/country-code?keyword=zzz")),
    );

    expect(b.code).toBe(200);
    expect(b.data).toEqual([]);
  });
});

describe("postal-code 两种查询方式", () => {
  it("type=1 邮编查地区用 eq + single", async () => {
    fromReturns({
      data: { province: "广东省", city: "广州市", postCode: "524200" },
      error: null,
    });

    const b = await body(
      await postalCode(
        req("http://x/api/postal-code?keyword=524200&type=1"),
      ),
    );

    expect(b.code).toBe(200);
    expect(supabase.from.mock.results[0]?.value.eq).toHaveBeenCalledWith(
      "postCode",
      "524200",
    );
    expect(
      supabase.from.mock.results[0]?.value.single,
    ).toHaveBeenCalled();
  });

  // 修前两种情况共用「未找到相关邮政编码信息」，DB 故障会被误报成查无数据
  it("type=1 未命中（PGRST116）返回查无数据，与 DB 故障区分开", async () => {
    fromReturns({ data: null, error: { code: "PGRST116", message: "no rows" } });

    const b = await body(
      await postalCode(req("http://x/api/postal-code?keyword=999999&type=1")),
    );

    expect(b.code).toBe(500);
    expect(b.msg).toBe("未找到相关邮政编码信息");
  });

  it("type=1 其它错误码按服务端错误处理，不谎报查无数据", async () => {
    fromReturns({
      data: null,
      error: { code: "08006", message: "connection failure" },
    });

    const b = await body(
      await postalCode(req("http://x/api/postal-code?keyword=524200&type=1")),
    );

    expect(b.msg).toBe("服务开小差，请稍后重试");
  });

  it("type=2 未命中时报查无数据", async () => {
    fromReturns({ data: [], error: null });

    const b = await body(
      await postalCode(req("http://x/api/postal-code?keyword=zzz&type=2")),
    );

    expect(b.msg).toBe("未找到相关邮政编码信息");
  });

  it("type 非法时报参数错误", async () => {
    for (const t of ["3", "abc", "0"]) {
      const b = await body(
        await postalCode(
          req(`http://x/api/postal-code?keyword=x&type=${encodeURIComponent(t)}`),
        ),
      );

      expect(b.code).toBe(500);
      expect(b.msg).toContain("type");
    }
    // 参数不合法时不该走到查库
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

// =====================================================================
// B7：空数据必须报 500，不能返回 code:200 + data:null/{} 的成功壳
// =====================================================================
describe("B7 RPC 无结果时遵守响应体契约", () => {
  for (const route of [
    { name: "chinese-poetry", fn: chinesePoetry, url: "" },
    { name: "riddle", fn: riddle, url: "" },
  ]) {
    it(`${route.name}: data 为 null 时 code=500 + data=null`, async () => {
      rpcReturns({ data: null, error: null });

      const b = await body(await route.fn(req(`http://x/api/${route.name}${route.url}`)));

      expect(b.code).toBe(500);
      expect(b.msg).toBe("暂无数据");
      expect(b.data).toBeNull();
    });
  }

  it("chinese-poetry: author 超长在上游 RPC 之前就被拒", async () => {
    const b = await body(
      await chinesePoetry(
        req(`http://x/api/chinese-poetry?author=${"z".repeat(21)}`),
      ),
    );

    expect(b.code).toBe(500);
    expect(b.msg).toContain("author");
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("chinese-poetry: author 合法时透传给 RPC", async () => {
    rpcReturns({ data: { content: "诗", author: "李白" }, error: null });

    await chinesePoetry(req("http://x/api/chinese-poetry?author=%E6%9D%8E%E7%99%BD"));

    expect(supabase.rpc).toHaveBeenCalledWith("get_random_chinese_poetry", {
      author_param: "李白",
    });
  });

  it("riddle: 只取 riddle/answer 两个字段", async () => {
    rpcReturns({
      data: { riddle: "谜面", answer: "谜底", id: 1, from: "隐藏" },
      error: null,
    });

    // 该路由签名是 GET()，不接收 request
    const b = await body(await riddle());

    expect(b.code).toBe(200);
    expect(b.data).toEqual({ riddle: "谜面", answer: "谜底" });
  });
});

describe("hitokoto", () => {
  it("正常返回文案", async () => {
    rpcReturns(
      { data: { content: "一言", from: "来源" }, error: null },
    );

    const b = await body(await hitokoto(req("http://x/api/hitokoto")));

    expect(b.code).toBe(200);
    expect(b.data).toEqual({ content: "一言", from: "来源" });
  });

  it("format=text 直出纯文本", async () => {
    rpcReturns({ data: { content: "直出文本" }, error: null });

    const res = await hitokoto(req("http://x/api/hitokoto?format=text"));

    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("直出文本");
  });

  it("type 含非法值时报错，不透传给 RPC", async () => {
    const b = await body(
      await hitokoto(req("http://x/api/hitokoto?type=a,zzz")),
    );

    expect(b.code).toBe(500);
    expect(b.msg).toContain("type");
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("minLength > maxLength 时报错", async () => {
    const b = await body(
      await hitokoto(req("http://x/api/hitokoto?minLength=50&maxLength=10")),
    );

    expect(b.code).toBe(500);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("type 合法时透传给 RPC", async () => {
    rpcReturns({ data: { content: "c" }, error: null });

    await hitokoto(req("http://x/api/hitokoto?type=a,b&minLength=5&maxLength=20"));

    expect(supabase.rpc).toHaveBeenCalledWith("get_random_hitokoto", {
      types: ["a", "b"],
      minlength: 5,
      maxlength: 20,
    });
  });

  it("data 为 null 时返回「暂无数据」", async () => {
    rpcReturns({ data: null, error: null });

    const b = await body(await hitokoto(req("http://x/api/hitokoto")));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("暂无数据");
  });
});
