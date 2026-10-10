import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as randomAvatar } from "@/app/api/random-avatar/route";
import { GET as solarTerm } from "@/app/api/solar-term/route";

const req = (url: string) => new NextRequest(url);

async function body(res: Response) {
  return (await res.json()) as {
    code: number;
    msg: string;
    data: unknown;
    timestamp: number;
  };
}

/** 从 SVG 文本里取出 width 属性值 */
const svgWidth = (svg: string) =>
  svg.match(/\bwidth="([^"]+)"/)?.[1] ?? "";

describe("GET /api/random-avatar", () => {
  // B2 的回归点：此前 clamp(parseInt("abc")) === NaN，
  // createAvatar 收到 size=NaN 会产出 width="NaN" 的坏 SVG
  it("size 非数字时回退 128，SVG 宽高不会变成 NaN", async () => {
    for (const bad of ["abc", "", "!"]) {
      const res = await randomAvatar(
        req(`http://x/api/random-avatar?size=${encodeURIComponent(bad)}`),
      );
      const svg = await res.text();

      expect(svgWidth(svg)).not.toBe("NaN");
      expect(svgWidth(svg)).toBe("128");
      expect(svg).not.toContain("NaN");
    }
  });

  it("count 非数字时按 1 个处理（返回 SVG 本体而非 URL 数组）", async () => {
    const res = await randomAvatar(
      req("http://x/api/random-avatar?count=abc"),
    );

    expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(await res.text()).toContain("<svg");
  });

  it("size 按 [16,512] 钳制", async () => {
    expect(
      svgWidth(await (await randomAvatar(req("http://x/api/random-avatar?size=1"))).text()),
    ).toBe("16");
    expect(
      svgWidth(
        await (await randomAvatar(req("http://x/api/random-avatar?size=9999"))).text(),
      ),
    ).toBe("512");
    expect(
      svgWidth(
        await (await randomAvatar(req("http://x/api/random-avatar?size=256"))).text(),
      ),
    ).toBe("256");
  });

  it("count > 1 时返回 URL 数组，且带上正确的 size", async () => {
    const b = await body(
      await randomAvatar(req("http://x/api/random-avatar?count=5&size=64")),
    );

    const urls = b.data as string[];

    expect(urls).toHaveLength(5);
    for (const u of urls) {
      expect(u).toContain("/api/random-avatar?");
      expect(u).toContain("size=64");
    }
  });

  it("style 非法时回退 adventurer，不会因取不到风格而 500", async () => {
    const res = await randomAvatar(
      req("http://x/api/random-avatar?style=definitely-not-a-style"),
    );

    expect(res.status).toBe(200);
    expect(await res.text()).toContain("<svg");
  });

  it("样式与尺寸确定时结果稳定（同 seed 同输出）", async () => {
    const a = await (
      await randomAvatar(
        req("http://x/api/random-avatar?seed=fixed-seed&style=bottts&size=128"),
      )
    ).text();
    const b = await (
      await randomAvatar(
        req("http://x/api/random-avatar?seed=fixed-seed&style=bottts&size=128"),
      )
    ).text();

    expect(a).toBe(b);
  });

  it("SVG 响应带长期缓存头", async () => {
    const res = await randomAvatar(req("http://x/api/random-avatar"));

    expect(res.headers.get("Cache-Control")).toBe("public, max-age=31536000");
  });
});

describe("GET /api/solar-term", () => {
  // B3 的回归点：Lunar.fromYmd(y,1,1).getJieQiTable() 返回的是跨年区间
  // （上年 12 月～次年 3 月，共 31 项），不过滤会把相邻年份的节气和
  // 重复节气名一起返回
  it("只返回请求年份的 24 个节气", async () => {
    const b = await body(await solarTerm(req("http://x/api/solar-term?year=2026")));

    expect(b.code).toBe(200);
    expect(b.data).toHaveLength(24);
  });

  it("结果里不出现其它年份的日期，且节气名不重复", async () => {
    const rows = (
      await body(await solarTerm(req("http://x/api/solar-term?year=2026")))
    ).data as { name: string; date: string }[];

    expect(rows.every((r) => r.date.startsWith("2026"))).toBe(true);
    expect(new Set(rows.map((r) => r.name)).size).toBe(24);
  });

  it("按时间正序返回", async () => {
    const rows = (
      await body(await solarTerm(req("http://x/api/solar-term?year=2026")))
    ).data as { date: string }[];

    const dates = rows.map((r) => r.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it("多个年份各自都是 24 个且互不串台", async () => {
    for (const year of [2000, 2024, 2100]) {
      const rows = (
        await body(await solarTerm(req(`http://x/api/solar-term?year=${year}`)))
      ).data as { date: string }[];

      expect(rows, `year ${year}`).toHaveLength(24);
      expect(rows.every((r) => r.date.startsWith(String(year)))).toBe(true);
    }
  });

  it("年份非法时报参数错误", async () => {
    for (const bad of ["abc", "20", "202601", "1899", "2101"]) {
      const b = await body(
        await solarTerm(
          req(`http://x/api/solar-term?year=${encodeURIComponent(bad)}`),
        ),
      );

      expect(b.code, `year=${bad}`).toBe(500);
      expect(b.data).toBeNull();
    }
  });

  it("不传年份时用当前年，并同样返回 24 个", async () => {
    const b = await body(await solarTerm(req("http://x/api/solar-term")));
    const thisYear = new Date().getFullYear();

    expect(b.data).toHaveLength(24);
    expect(
      ((b.data as { date: string }[])[0]?.date ?? "").startsWith(String(thisYear)),
    ).toBe(true);
  });

  it("响应带一天缓存头", async () => {
    const res = await solarTerm(req("http://x/api/solar-term?year=2026"));

    expect(res.headers.get("Cache-Control")).toBe("public, max-age=86400");
  });
});
