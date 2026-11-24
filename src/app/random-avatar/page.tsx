import ClientComponent from "./ClientComponent";

import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-09 09:25:03
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 09:41:58
 * @Description: 随机头像
 */

const seo = {
  title: "随机头像",
  description:
    "随机头像生成器：基于 DiceBear 提供十余种风格的 SVG 头像，支持固定 seed 复现、批量生成与自定义尺寸。",
  path: "/random-avatar",
};

export const metadata = createPageMetadata(seo);

export default function RandomAvatar() {
  return <ClientComponent title={seo.title} />;
}
