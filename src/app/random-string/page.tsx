import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:18:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 09:05:28
 * @Description: 随机字符串
 */

export const metadata: Metadata = {
  title: "随机字符串",
};

export default function RandomString() {
  return <ClientComponent title="随机字符串" />;
}
