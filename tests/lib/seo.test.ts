import { describe, expect, it } from "vitest";

import {
  createPageMetadata,
  createSiteJsonLd,
  createToolJsonLd,
  SITE_URL,
} from "@/lib/seo";

const options = {
  title: "BMI 计算器",
  description: "在线计算 BMI 指数并给出体重状态。",
  path: "/bmi",
};

describe("createPageMetadata", () => {
  it("返回页面标题、独立描述与站内 canonical 路径", () => {
    const metadata = createPageMetadata(options);

    expect(metadata.title).toBe("BMI 计算器");
    expect(metadata.description).toBe(options.description);
    expect(metadata.alternates?.canonical).toBe("/bmi");
  });

  it("不同页面的 canonical 互不相同（自引用而非全站统一）", () => {
    const other = createPageMetadata({ ...options, path: "/qrcode" });

    expect(other.alternates?.canonical).toBe("/qrcode");
    expect(other.alternates?.canonical).not.toBe(options.path);
  });
});

describe("createSiteJsonLd", () => {
  it("输出 Organization + WebSite 的 @graph，锚点与站点域名一致", () => {
    const schema = createSiteJsonLd();
    const graph = schema["@graph"] as Array<Record<string, unknown>>;

    expect(schema["@context"]).toBe("https://schema.org");
    expect(graph.map((entity) => entity["@type"])).toEqual([
      "Organization",
      "WebSite",
    ]);
    expect(graph[1]?.publisher).toEqual({
      "@id": `${SITE_URL}/#organization`,
    });
  });
});

describe("createToolJsonLd", () => {
  it("输出 WebApplication，URL 由站点域名拼接站内路径，免费工具价格为 0", () => {
    const schema = createToolJsonLd(options);

    expect(schema["@type"]).toBe("WebApplication");
    expect(schema.url).toBe(`${SITE_URL}/bmi`);
    expect(schema.name).toBe(options.title);
    expect(schema.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    });
  });
});
