import type { MetadataRoute } from "next";

import { createClient } from "@supabase/supabase-js";

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

/**
 * 内容最近更新时间：取接口/分类的最大 created_at。
 * sitemap 生成于构建期，这里直接用 @supabase/supabase-js 建 anon 客户端，
 * 绕开会读 cookies 的 SSR 客户端（lib/supabase/server），避免 sitemap 被拖成动态渲染。
 * 此前固定 new Date()，每次部署 36 个 URL 集体刷新 lastmod，属于不可信信号；
 * 现在只有内容真的变化（新增接口/分类）时 lastmod 才会前进。
 */
async function getContentLastModified(): Promise<Date> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const [apisResult, categorysResult] = await Promise.all([
      supabase
        .from("ea_apis")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("ea_categorys")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    const candidates = [
      apisResult.data?.[0]?.created_at,
      categorysResult.data?.[0]?.created_at,
    ].filter((value): value is string => !!value);

    if (candidates.length) {
      return new Date(
        Math.max(...candidates.map((value) => new Date(value).getTime())),
      );
    }
  } catch {
    // 构建期查询失败（如本地缺 Supabase env）：回退构建时间，不阻断 sitemap 生成
  }

  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getContentLastModified();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...TOOL_ROUTES.map((route) => ({
      url: `${BASE_URL}/${route}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      // 接口文档页：此前不在清单里且全站无内链入口，成为孤儿页，补入 sitemap
      url: `${BASE_URL}/docs`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];
}
