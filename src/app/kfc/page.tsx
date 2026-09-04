import type { Metadata } from "next";

import QuoteWorld from "@/components/QuoteWorld";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:59:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:59:34
 * @Description: 疯狂星期四
 */

export const metadata: Metadata = {
  title: "疯狂星期四",
};

export default function Kfc() {
  return <QuoteWorld title="疯狂星期四" />;
}
