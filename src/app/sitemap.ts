import type { MetadataRoute } from "next";

/** 站点域名：env 缺失时回退线上域名，避免生成空 <loc> 导致整个 sitemap 被拒收 */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://api.baiwumm.com";

/** 公开工具页路由清单（src/app 下的一级目录，与首页卡片一致） */
const TOOL_ROUTES = [
  "almanac",
  "barcode",
  "bing-wallpaper",
  "bmi",
  "chicken-soup",
  "chinese-poetry",
  "cold-fact",
  "color-conversion",
  "country-code",
  "dairy-joke",
  "diary-poetry",
  "dog-diary",
  "hitokoto",
  "holiday",
  "idcard",
  "ip-region",
  "kfc",
  "license-plate",
  "love-words",
  "password-strength",
  "postal-code",
  "qrcode",
  "random-avatar",
  "random-color",
  "random-emoji",
  "random-idcard",
  "random-image",
  "random-person",
  "random-string",
  "random-user",
  "riddle",
  "solar-term",
  "swearing",
  "tailwind-color-palette",
  "tongue-twister",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...TOOL_ROUTES.map((route) => ({
      url: `${BASE_URL}/${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
