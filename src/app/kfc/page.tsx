import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:59:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:59:34
 * @Description: 疯狂星期四
 */

const seo = {
  title: "疯狂星期四",
  description:
    "疯狂星期四文案生成器：随机返回一条 KFC 疯四文学，支持纯文本直出，周四发圈整活必备。",
  path: "/kfc",
};

export const metadata = createPageMetadata(seo);

export default function Kfc() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld title={seo.title} />
    </ToolPage>
  );
}
