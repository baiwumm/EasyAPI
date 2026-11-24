import type { Metadata } from "next";

/** 站点域名：与 robots.ts / sitemap.ts 保持同一回退策略 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://api.baiwumm.com";

/** 页面 SEO 入参：title 经 layout 模板拼接品牌名后展示 */
interface PageSeoOptions {
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
