import { describe, expect, it } from "vitest";

import {
  createPageMetadata,
  createSiteJsonLd,
  createToolJsonLd,
  SITE_URL,
} from "@/lib/seo";

const content = {
  intro: "在线计算 BMI 指数并给出体重状态。",
  steps: ["输入身高", "输入体重", "查看结果"],
  faqs: [{ question: "BMI 怎么算？", answer: "体重除以身高的平方。" }],
  example: { code: 'curl "https://api.baiwumm.com/api/bmi?height=175&weight=65"' },
};

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
    // 无内容块时返回顶层对象；断言前先放宽为 Record，兼容带内容块时的 @graph 形态
    const schema = createToolJsonLd(options) as Record<string, unknown>;

    expect(schema["@type"]).toBe("WebApplication");
    expect(schema.url).toBe(`${SITE_URL}/bmi`);
    expect(schema.name).toBe(options.title);
    expect(schema.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    });
  });

  it("提供内容块时输出 WebApplication + HowTo + FAQPage 的 @graph", () => {
    const schema = createToolJsonLd(options, content);
    const graph = schema["@graph"] as Array<Record<string, unknown>>;

    expect(graph.map((entity) => entity["@type"])).toEqual([
      "WebApplication",
      "HowTo",
      "FAQPage",
    ]);

    const howTo = graph[1] as Record<string, unknown>;
    const steps = howTo.step as Array<Record<string, unknown>>;

    expect(steps).toHaveLength(3);
    expect(steps[0]?.position).toBe(1);

    const faqPage = graph[2] as Record<string, unknown>;
    const questions = faqPage.mainEntity as Array<Record<string, unknown>>;

    expect(questions[0]?.name).toBe("BMI 怎么算？");
  });
});
