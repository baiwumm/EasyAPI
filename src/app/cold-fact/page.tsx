import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 10:59:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 10:59:34
 * @Description: 每日冷知识
 */

const seo = {
  title: "每日冷知识",
  description:
    "每日冷知识 API 与在线页面：随机返回一条有趣冷知识，含分类与来源，支持 format=text 纯文本直出。",
  path: "/cold-fact",
};

export const metadata = createPageMetadata(seo);

export default function ColdFact() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld formWhoField="source" fromField="category" title={seo.title} />
    </ToolPage>
  );
}
