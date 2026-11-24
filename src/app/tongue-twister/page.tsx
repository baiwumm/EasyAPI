import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 09:47:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 09:59:24
 * @Description: 每日绕口令
 */

const seo = {
  title: "每日绕口令",
  description:
    "每日绕口令：随机返回一条绕口令文案，支持纯文本直出，适合口才练习与趣味挑战。",
  path: "/tongue-twister",
};

export const metadata = createPageMetadata(seo);

export default function TongueTwister() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld title={seo.title} />
    </ToolPage>
  );
}
