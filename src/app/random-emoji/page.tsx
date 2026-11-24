import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 16:07:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 16:07:51
 * @Description: 随机表情
 */

const seo = {
  title: "随机表情",
  description:
    "随机 emoji 生成器：随机返回 emoji 字符及其英文名称，可批量生成，适合抽奖、测试数据与趣味场景。",
  path: "/random-emoji",
};

export const metadata = createPageMetadata(seo);

export default function RandomEmoji() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
