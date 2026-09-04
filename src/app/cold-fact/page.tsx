import type { Metadata } from "next";

import QuoteWorld from "@/components/QuoteWorld";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 10:59:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 10:59:34
 * @Description: 每日冷知识
 */

export const metadata: Metadata = {
  title: "每日冷知识",
};

export default function ColdFact() {
  return (
    <QuoteWorld formWhoField="source" fromField="category" title="每日冷知识" />
  );
}
