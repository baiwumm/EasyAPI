import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:27:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 10:36:35
 * @Description: 飞花令
 */

export const metadata: Metadata = {
  title: "飞花令",
};

export default function ChinesePoetry() {
  return <ClientComponent title="飞花令" />;
}
