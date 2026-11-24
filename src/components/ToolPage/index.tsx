/*
 * @Description: 公开工具页统一骨架：注入 JSON-LD 并承载页面内容。
 * 新增工具页必须经此组件包裹；提供 content 时在交互区下方渲染
 * SSR 内容块（介绍/步骤/FAQ/示例），并同步输出 HowTo + FAQPage 标记
 */
import type { ReactNode } from "react";
import type { PageSeoOptions, ToolContentData } from "@/lib/seo";

import ToolContent from "@/components/ToolContent";
import JsonLd from "@/components/JsonLd";
import { createToolJsonLd } from "@/lib/seo";

interface ToolPageProps {
  /** 页面 SEO 信息（与 metadata 同一来源） */
  seo: PageSeoOptions;
  /** SSR 内容块：提供后生成长文正文与 HowTo/FAQPage 标记 */
  content?: ToolContentData;
  children: ReactNode;
}

const ToolPage = ({ children, content, seo }: ToolPageProps) => (
  <>
    <JsonLd schema={createToolJsonLd(seo, content)} />
    {children}
    {content ? <ToolContent content={content} /> : null}
  </>
);

export default ToolPage;
