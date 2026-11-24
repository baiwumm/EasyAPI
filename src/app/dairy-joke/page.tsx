import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 10:25:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 10:26:01
 * @Description: 每日笑话
 */

const seo = {
  title: "每日笑话",
  description:
    "每日笑话接口与在线页面：随机返回一条笑话，支持 format=text 纯文本直出，给应用加点快乐。",
  path: "/dairy-joke",
};

export const metadata = createPageMetadata(seo);

export default function DairyJoke() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld title={seo.title} />
    </ToolPage>
  );
}
