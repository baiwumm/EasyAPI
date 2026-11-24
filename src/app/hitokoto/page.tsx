import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-26 18:08:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 09:23:59
 * @Description: 每日一言
 */

const seo = {
  title: "每日一言",
  description:
    "每日一言 API 与在线页面：随机返回动画、文学、诗词、网易云等类型的句子，支持按类型与长度筛选，可纯文本直出。",
  path: "/hitokoto",
};

export const metadata = createPageMetadata(seo);

export default function Hitokoto() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld mode="hitokoto" title={seo.title} />
    </ToolPage>
  );
}
