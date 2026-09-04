import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 15:16:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 15:17:29
 * @Description: 生成条形码
 */

export const metadata: Metadata = {
  title: "生成条形码",
};

export default function Barcode() {
  return <ClientComponent title="生成条形码" />;
}
