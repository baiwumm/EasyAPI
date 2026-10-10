import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as randomString } from "@/app/api/random-string/route";
import { GET as bmi } from "@/app/api/bmi/route";

// 路由 handler 读的是 nextUrl.searchParams，必须用 NextRequest 而非裸 Request
const req = (url: string) => new NextRequest(url);

async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
    timestamp: number;
  };
}

describe("GET /api/random-string", () => {
  // B1 的回归点：此前 parseInt("abc") 得到 NaN，
  // cryptoRandomString 抛错后 catchError 把库的英文原文透给前端
  it("length 完全无法解析时回退默认长度 16，不抛错也不泄露库原文", async () => {
    for (const bad of ["abc", "", "!"]) {
      const res = await randomString(
        req(`http://x/api/random-string?length=${encodeURIComponent(bad)}`),
      );

      const b = await body(res);

      expect(b.code).toBe(200);
      expect(String(b.msg)).toBe("请求成功");
      expect((b.data as string[])[0]).toHaveLength(16);
    }
  });

  it("length 带数字前缀时按 parseInt 截断取整（可接受，至少不是 NaN）", async () => {
    // parseInt("1eee") === 1，被 min 兜住为 1；不会得到 NaN
    const b = await body(
      await randomString(req("http://x/api/random-string?length=1eee")),
    );

    expect((b.data as string[])[0]).toHaveLength(1);
  });

  it("count 非数字时回退 1 条，不返回空数组", async () => {
    const b = await body(
      await randomString(req("http://x/api/random-string?count=xyz")),
    );

    expect(b.data).toHaveLength(1);
  });

  it("length 与 count 按边界钳制", async () => {
    const zero = await body(
      await randomString(req("http://x/api/random-string?length=0")),
    );

    expect(zero.data).toHaveLength(1);

    const over = await body(
      await randomString(req("http://x/api/random-string?length=9999")),
    );

    expect((over.data as string[])[0]).toHaveLength(100);

    const many = await body(
      await randomString(
        req("http://x/api/random-string?count=9999&length=4"),
      ),
    );

    expect(many.data).toHaveLength(50);
  });

  it("type 非法时报参数错误，不落到生成逻辑", async () => {
    const b = await body(
      await randomString(req("http://x/api/random-string?type=not-a-real-type")),
    );

    expect(b.code).toBe(500);
    expect(String(b.msg)).toContain("type");
    expect(b.data).toBeNull();
  });

  it("type 合法时按类型生成", async () => {
    const b = await body(
      await randomString(
        req("http://x/api/random-string?type=numeric&length=32&count=1"),
      ),
    );

    expect((b.data as string[])[0]).toMatch(/^\d{32}$/);
  });

  it("characters 超过 256 被拒（此前无上限，可绕过 type 白名单）", async () => {
    const long = "a".repeat(257);
    const b = await body(
      await randomString(
        req(`http://x/api/random-string?characters=${long}`),
      ),
    );

    expect(b.code).toBe(500);
    expect(String(b.msg)).toContain("characters");
    expect(b.data).toBeNull();
  });

  it("characters 长度合法时优先于 type", async () => {
    const b = await body(
      await randomString(
        req("http://x/api/random-string?characters=AB&length=20&count=1"),
      ),
    );

    expect((b.data as string[])[0]).toMatch(/^[AB]{20}$/);
  });
});

describe("GET /api/bmi", () => {
  // B4 的回归点：height=0 会让分母为 0 得到 Infinity
  it("身高为 0 / 负数 / 超上限时报错，不返回 Infinity", async () => {
    for (const h of ["0", "-10", "9999", "abc"]) {
      const b = await body(
        await bmi(req(`http://x/api/bmi?height=${h}&weight=60`)),
      );

      expect(b.code).toBe(500);
      expect(b.data).toBeNull();
      expect(String(b.msg)).not.toContain("Infinity");
    }
  });

  it("体重为 0 / 负数 / 超上限时同样被拒", async () => {
    for (const w of ["0", "-1", "9999"]) {
      const b = await body(
        await bmi(req(`http://x/api/bmi?height=170&weight=${w}`)),
      );

      expect(b.code).toBe(500);
      expect(b.data).toBeNull();
    }
  });

  it("缺少任一参数时报错", async () => {
    expect(
      (await body(await bmi(req("http://x/api/bmi")))).code,
    ).toBe(500);
    expect(
      (await body(await bmi(req("http://x/api/bmi?height=170")))).code,
    ).toBe(500);
    expect(
      (await body(await bmi(req("http://x/api/bmi?weight=60")))).code,
    ).toBe(500);
  });

  it("正常输入按 WHO 口径计算并分级", async () => {
    const b = await body(
      await bmi(req("http://x/api/bmi?height=168&weight=60")),
    );

    expect(b.code).toBe(200);
    expect(b.data).toEqual({ bmi: "21.26", status: "正常体重" });
  });

  // B4 的另一半：前后端口径必须一致。
  // 后端阈值是 [18.5, 24.9)，前端 isNormal 同步为 bmi >= 18.5 && bmi < 24.9
  it("BMI 落在 24.0~24.9 之间判「正常体重」，与前端口径一致", async () => {
    const b = await body(
      await bmi(req("http://x/api/bmi?height=168&weight=69.4")),
    );

    expect((b.data as { bmi: string }).bmi).toBe("24.59");
    expect((b.data as { status: string }).status).toBe("正常体重");
  });

  it("分级边界：过低 / 正常 / 超重 / 肥胖", async () => {
    const at = async (h: string, w: string) =>
      (
        (await body(await bmi(req(`http://x/api/bmi?height=${h}&weight=${w}`)))
        ).data as { status: string }
      ).status;

    expect(await at("180", "50")).toBe("体重过低"); // 15.43
    expect(await at("180", "70")).toBe("正常体重"); // 21.60
    expect(await at("180", "81")).toBe("超重"); // 25.00
    expect(await at("180", "97")).toBe("肥胖"); // 29.94，≥ BMI_OBESE
  });
});
