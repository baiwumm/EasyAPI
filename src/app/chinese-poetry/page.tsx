import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:27:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 10:36:35
 * @Description: 飞花令
 */

const seo = {
  title: "飞花令",
  description:
    "飞花令古诗词查询：随机返回一首古诗词，支持按作者（如李白）筛选，可在线吟诗或调用古诗词接口。",
  path: "/chinese-poetry",
};

export const metadata = createPageMetadata(seo);

export default function ChinesePoetry() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld mode="poetry" title={seo.title} />
    </ToolPage>
  );
}
