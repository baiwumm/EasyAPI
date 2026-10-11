import { describe, expect, it } from "vitest";

import { parseApiBody, parseCategoryBody } from "@/lib/server/write-guard";

const validApi = {
  category_id: "0f7f1b1e-6d4a-4c8b-9f2e-1a2b3c4d5e6f",
  name: "每日推荐",
  path: "/chicken-soup",
  method: "GET",
  sort: 1,
};

describe("parseApiBody 白名单", () => {
  it("不在白名单里的列被直接丢掉，不透传到 update payload", () => {
    const { payload, error } = parseApiBody(
      { ...validApi, id: "1", call_count: 999, created_at: "x" },
      "create",
    );

    expect(error).toBeUndefined();
    expect(payload).toEqual(validApi);
  });

  it("请求体不是对象时报格式错误", () => {
    expect(parseApiBody(null, "create").error).toBe("请求体格式错误");
    expect(parseApiBody("abc", "update").error).toBe("请求体格式错误");
  });
});

describe("parseApiBody create", () => {
  it("缺少必填项时逐项报错", () => {
    expect(parseApiBody({}, "create").error).toBe("参数 category_id 必填");

    const { error } = parseApiBody(
      { ...validApi, name: "" },
      "create",
    );

    expect(error).toBe("参数 name 必填");
  });

  it("method 不在枚举内时不合法", () => {
    expect(
      parseApiBody({ ...validApi, method: "FETCH" }, "create").error,
    ).toBe("参数 method 不合法");
  });
});

// C14：update 模式此前只过滤白名单，不校验取值，
// 直接调 API 可以写 sort:-999、name 超长、path 不带 / 前缀
describe("parseApiBody update", () => {
  it("空 payload 被拦下，不再让 update({}) 打到数据库", () => {
    expect(parseApiBody({}, "update").error).toBe("没有需要更新的字段");
    expect(parseApiBody({ id: "1", call_count: 1 }, "update").error).toBe(
      "没有需要更新的字段",
    );
  });

  it("sort 必须是 1 ~ 99 的整数", () => {
    expect(parseApiBody({ sort: -999 }, "update").error).toContain("sort");
    expect(parseApiBody({ sort: 100 }, "update").error).toContain("sort");
    expect(parseApiBody({ sort: 1.5 }, "update").error).toContain("sort");
    expect(parseApiBody({ sort: "5" }, "update").error).toContain("sort");

    const { payload } = parseApiBody({ sort: 99 }, "update");

    expect(payload).toEqual({ sort: 99 });
  });

  it("name / operation_id 长度上限 100，desc 上限 200", () => {
    expect(
      parseApiBody({ name: "a".repeat(101) }, "update").error,
    ).toBe("参数 name 长度不能超过 100 个字符");
    expect(
      parseApiBody({ operation_id: "a".repeat(101) }, "update").error,
    ).toContain("operation_id");
    expect(parseApiBody({ desc: "a".repeat(201) }, "update").error).toContain(
      "desc",
    );

    // 空 desc 是合法值（表单允许不填描述）
    expect(parseApiBody({ desc: "" }, "update").error).toBeUndefined();
  });

  it("path 必须以 / 开头且不超 100 字符", () => {
    expect(parseApiBody({ path: "chicken-soup" }, "update").error).toBe(
      "参数 path 必须以 / 开头",
    );
    expect(parseApiBody({ path: "/" + "a".repeat(100) }, "update").error).toBe(
      "参数 path 长度不能超过 100 个字符",
    );
  });

  it("布尔字段不接受字符串", () => {
    expect(parseApiBody({ pinned: "true" }, "update").error).toBe(
      "参数 pinned 必须是布尔值",
    );
    expect(parseApiBody({ is_featured: false }, "update").error).toBeUndefined();
  });

  it("update 也校验 method 枚举", () => {
    expect(parseApiBody({ method: "FETCH" }, "update").error).toBe(
      "参数 method 不合法",
    );
    expect(parseApiBody({ method: "POST" }, "update").payload).toEqual({
      method: "POST",
    });
  });
});

describe("parseCategoryBody", () => {
  it("create 缺少 name 时必填", () => {
    expect(parseCategoryBody({}, "create").error).toBe("参数 name 必填");
  });

  it("update 空 payload 被拦下", () => {
    expect(parseCategoryBody({}, "update").error).toBe("没有需要更新的字段");
  });

  it("name / desc / sort 的取值范围与接口一致", () => {
    expect(parseCategoryBody({ name: "a".repeat(101) }, "update").error).toBe(
      "参数 name 长度不能超过 100 个字符",
    );
    expect(parseCategoryBody({ sort: 0 }, "update").error).toContain("sort");
    expect(parseCategoryBody({ sort: 50 }, "update").payload).toEqual({
      sort: 50,
    });
  });
});
