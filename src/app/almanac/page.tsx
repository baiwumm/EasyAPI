import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 16:41:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 16:42:06
 * @Description: 十二时辰黄历
 */

export const metadata: Metadata = {
  title: "十二时辰黄历",
};

export default function Almanac() {
  return <ClientComponent title="十二时辰黄历" />;
}
