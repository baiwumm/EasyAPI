/*
 * @Description: JSON-LD 结构化数据渲染（schema.org）：供搜索引擎与 AI 引擎解析站点实体。
 * 服务端组件，schema 由 lib/seo.ts 的构造器生成
 */
import type { FC } from "react";

interface JsonLdProps {
  schema: Record<string, unknown>;
}

const JsonLd: FC<JsonLdProps> = ({ schema }) => (
  <script
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    type="application/ld+json"
  />
);

export default JsonLd;
