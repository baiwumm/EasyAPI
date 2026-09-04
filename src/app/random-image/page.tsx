import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 09:50:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 10:02:41
 * @Description: 随机图片
 */

export const metadata: Metadata = {
  title: "随机图片",
};

export default function RandomImage() {
  return <ClientComponent title="随机图片" />;
}
