import type { Metadata } from "next";

import { AUTHOR_HANDLE, AUTHOR_SITE_URL } from "@/lib/author";

/** 站点域名：与 robots.ts / sitemap.ts 保持同一回退策略 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://api.baiwumm.com";

/** 站点名称：JSON-LD 实体与 og:site_name 同源 */
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "EasyAPI";

/** 页面 SEO 入参：title 经 layout 模板拼接品牌名后展示 */
export interface PageSeoOptions {
  /** 页面标题 */
  title: string;
  /** 页面描述：每页一句独立文案，避免全站继承首页描述 */
  description: string;
  /** 站内规范路径（如 /bmi），用于生成自引用 canonical */
  path: string;
}

/**
 * 公开工具页统一 metadata：逐页独立 description + 自引用 canonical。
 * 此前全站共用 layout 的默认描述，导致 30+ 页 meta description 重复且与页面内容
 * 无关（如 BMI 页顶着「API 聚合平台」文案），新增页面必须经本函数提供自己的描述
 */
export function createPageMetadata({
  title,
  description,
  path,
}: PageSeoOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      // 站内路径即可，Next 会按 layout 的 metadataBase 拼出完整 URL
      canonical: path,
    },
  };
}

/**
 * 首页站点级实体：Organization（品牌/作者识别）+ WebSite（站点名）。
 * @id 固定锚点供其他实体引用（如工具页 publisher 指向 Organization）
 */
export function createSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: APP_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        founder: {
          "@type": "Person",
          name: AUTHOR_HANDLE,
          url: AUTHOR_SITE_URL,
        },
        sameAs: [AUTHOR_SITE_URL, `https://github.com/${AUTHOR_HANDLE}`],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: APP_NAME,
        url: SITE_URL,
        inLanguage: "zh-CN",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

/**
 * 工具页实体：WebApplication（免费在线工具）。
 * 全站均为免费工具，offers 固定 0 元；publisher 引用首页 Organization 锚点
 */
export function createToolJsonLd({ title, description, path }: PageSeoOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: "zh-CN",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
