import ClientComponent from "./ClientComponent";

import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 09:50:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 10:02:41
 * @Description: 随机图片
 */

const seo = {
  title: "随机图片",
  description:
    "随机图片 API：返回指定尺寸的真实照片地址（picsum.photos），可批量生成，适合占位图与开发测试。",
  path: "/random-image",
};

export const metadata = createPageMetadata(seo);

export default function RandomImage() {
  return <ClientComponent title={seo.title} />;
}
