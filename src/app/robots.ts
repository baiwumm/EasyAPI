import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://api.baiwumm.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api 是否对爬虫关闭属产品决策（影响公开接口的可发现性与配额），暂保持可抓取
      disallow: ["/admin", "/login"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
