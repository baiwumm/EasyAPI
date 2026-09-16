/*
 * @Description: 接口文档页（Scalar 渲染 public/openapi.yaml）
 */
import { ApiReference } from "@scalar/nextjs-api-reference";

// 文档页不依赖请求，构建期静态化
export const dynamic = "force-static";

export const GET = ApiReference({
  url: "/openapi.yaml",
  pageTitle: "EasyAPI 接口文档",
  title: "EasyAPI 开放接口",
  operationsSorter: "method",
  hideModels: true,
  telemetry: false,
  metaData: { description: "EasyAPI 聚合平台开放接口文档" },
  // Scalar 页面是独立 HTML，不加载站点 CSS 变量，主题色需写字面量（取自 globals.css 的 --accent）
  customCss: `
    .light-mode, .dark-mode { --scalar-color-accent: oklch(73.06% 0.1911 137.23); }
  `,
  theme: "alternate",
});
