/*
 * @Description: 公开工具页统一骨架：注入 WebApplication JSON-LD 并承载页面内容。
 * 新增工具页必须经此组件包裹；后续 SSR 内容块（介绍/FAQ/接口示例）也挂在这里
 */
import type { ReactNode } from "react";
import type { PageSeoOptions } from "@/lib/seo";

import JsonLd from "@/components/JsonLd";
import { createToolJsonLd } from "@/lib/seo";

interface ToolPageProps {
  /** 页面 SEO 信息（与 metadata 同一来源） */
  seo: PageSeoOptions;
  children: ReactNode;
}

const ToolPage = ({ children, seo }: ToolPageProps) => (
  <>
    <JsonLd schema={createToolJsonLd(seo)} />
    {children}
  </>
);

export default ToolPage;
