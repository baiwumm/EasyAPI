import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// @zxcvbn-ts/language-zh 的 CJS 入口会 require('@zxcvbn-ts/dictionary-compression/decompress')，
// 而该包的 CJS 产物是 module.exports = { default: fn }，裸 require 出来不是函数，
// 直接调用会抛 "decompress is not a function"。Next 的 bundler 会做默认导出 interop，
// 所以线上（pnpm build / dev）正常，只有 vitest 这种走原生 require 的场景会炸。
// 下面按包内 dist/translations.mjs 的结构给一份等价替身 + 小样本词库：
// 只影响中文命中率，不影响被测的路由逻辑。
vi.mock("@zxcvbn-ts/language-zh", () => ({
  translations: {
    warnings: {
      straightRow: "键盘上连续的按键排列容易被猜测。",
      keyPattern: "短的键盘模式很容易被猜测。",
      simpleRepeat: '"aaa"这样的重复字符很容易被猜测。',
      extendedRepeat: '"abcabcabc"这样的重复模式很容易被猜测。',
      sequences: '"abc"这样的常见字符序列很容易被猜测。',
      recentYears: "近几年的年份很容易被猜测。",
      dates: "日期很容易被猜测。",
      topTen: "这是一个被大量使用的密码。",
      topHundred: "这是一个常用密码。",
      common: "这是一个常见密码。",
      similarToCommon: "这与常见密码相似。",
      wordByItself: "单个单词很容易被猜测。",
      namesByThemselves: "单独的姓名很容易被猜测。",
      commonNames: "常见的姓名很容易被猜测。",
      userInputs: "不应包含任何个人信息或页面相关数据。",
      pwned: "您的密码已在互联网数据泄露中暴露。",
    },
    suggestions: {
      l33t: "避免使用可预测的字母替换，如用 @ 代替 a。",
      reverseWords: "避免使用常见单词的逆序拼写。",
      allUppercase: "将部分字母大写，而不是全部大写。",
      capitalization: "不仅仅是首字母大写，可以大写更多字母。",
      dates: "避免使用与您相关的日期和年份。",
      recentYears: "避免使用近几年的年份。",
      associatedYears: "避免使用与您相关的年份。",
      sequences: "避免使用常见的字符序列。",
      repeated: "避免重复的单词和字符。",
      longerKeyboardPattern: "使用更长的键盘模式，并多次改变输入方向。",
      anotherWord: "添加更多不太常见的单词。",
      useWords: "使用多个单词，但避免常见短语。",
      noNeed: "您可以在不使用符号、数字或大写字母的情况下创建强密码。",
      pwned: "如果您在其他地方也使用此密码，请更改它。",
    },
    timeEstimation: {
      ltSecond: "不到一秒",
      second: "{base} 秒",
      seconds: "{base} 秒",
      minute: "{base} 分钟",
      minutes: "{base} 分钟",
      hour: "{base} 小时",
      hours: "{base} 小时",
      day: "{base} 天",
      days: "{base} 天",
      month: "{base} 个月",
      months: "{base} 个月",
      year: "{base} 年",
      years: "{base} 年",
      centuries: "几个世纪",
    },
  },
  dictionary: {
    "commonWords-zh": ["密码", "你好", "欢迎使用", "管理员"],
    "firstnames-zh": ["伟", "芳"],
    "lastnames-zh": ["张", "李"],
    "wikipedia-zh": ["EasyAPI", "接口"],
  },
}));

import { POST } from "@/app/api/password-strength/route";

// 每个用例用不同 x-forwarded-for，避免共用同一个限流桶
let seq = 0;

const post = (body: unknown, ip = `10.0.0.${++seq}`) =>
  new NextRequest("http://x/api/password-strength", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

const rawPost = (raw: string, ip = `10.0.0.${++seq}`) =>
  new NextRequest("http://x/api/password-strength", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: raw,
  });

async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: Record<string, unknown> | null;
    timestamp: number;
  };
}

describe("POST /api/password-strength", () => {
  it("正常返回 zxcvbn 评分结果", async () => {
    const res = await POST(post({ password: "abc123456" }));
    const b = await body(res);

    expect(b.code).toBe(200);
    expect(b.data).not.toBeNull();
    expect(b.data).toMatchObject({
      score: expect.any(Number),
      guesses: expect.any(Number),
    });
    expect(typeof b.data?.crackTimesDisplay).toBe("object");
    expect(typeof b.data?.feedback).toBe("object");
  });

  it("空密码返回 code=500 与必填提示", async () => {
    const b = await body(await POST(post({ password: "" })));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("参数 password 必填");
    expect(b.data).toBeNull();
  });

  it("password 不是字符串时按必填处理", async () => {
    for (const bad of [{}, { password: 123 }, { password: null }, null]) {
      const b = await body(await POST(post(bad)));

      expect(b.code).toBe(500);
      expect(b.msg).toBe("参数 password 必填");
    }
  });

  it("body 不是合法 JSON 时按必填处理，不透出解析原文", async () => {
    const b = await body(await POST(rawPost("not-json")));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("参数 password 必填");
  });

  it("密码超长时拒绝", async () => {
    const b = await body(
      await POST(post({ password: "a".repeat(129) })),
    );

    expect(b.code).toBe(500);
    expect(b.msg).toContain("128");
  });

  // C13：zxcvbn 的返回里带 password 字段本身，响应不再回显输入
  it("响应不回显 password 字段", async () => {
    const b = await body(await POST(post({ password: "SuperSecret123" })));

    expect(b.code).toBe(200);
    expect(b.data).not.toHaveProperty("password");
    expect(JSON.stringify(b.data)).not.toContain("SuperSecret123");
  });
});

// C13：无限流时这个 CPU 密集接口就是现成的算力放大器
describe("POST /api/password-strength 限流", () => {
  const ip = "10.0.0.254";

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("同一 IP 每分钟超过 20 次后拒绝", async () => {
    for (let i = 0; i < 20; i++) {
      expect((await body(await POST(post({ password: "abc123" }, ip)))).code).toBe(
        200,
      );
    }

    const b = await body(await POST(post({ password: "abc123" }, ip)));

    expect(b.code).toBe(500);
    expect(b.msg).toBe("请求过于频繁，请稍后重试");
  });

  it("窗口结束后恢复放行", async () => {
    for (let i = 0; i < 21; i++) {
      await POST(post({ password: "abc123" }, ip));
    }

    vi.advanceTimersByTime(61 * 1000);

    expect((await body(await POST(post({ password: "abc123" }, ip)))).code).toBe(
      200,
    );
  });
});
