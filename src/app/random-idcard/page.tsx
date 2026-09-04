import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-11 15:48:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 15:48:26
 * @Description: 随机身份证号
 */

export const metadata: Metadata = {
  title: "随机身份证号",
};

export default function RandomIdCard() {
  return <ClientComponent title="随机身份证号" />;
}
