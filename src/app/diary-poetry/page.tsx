import type { Metadata } from "next";

import QuoteWorld from "@/components/QuoteWorld";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:22:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 14:22:27
 * @Description: 今日诗词
 */

export const metadata: Metadata = {
  title: "今日诗词",
};

export default function DiaryPoetry() {
  return (
    <QuoteWorld formWhoField="author" fromField="origin" title="今日诗词" />
  );
}
