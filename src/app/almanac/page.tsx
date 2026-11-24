import ClientComponent from "./ClientComponent";

import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 16:41:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 16:42:06
 * @Description: 十二时辰黄历
 */

const seo = {
  title: "十二时辰黄历",
  description:
    "十二时辰黄历查询：按日期返回十二时辰的宜忌、冲煞、纳音与九星，子时排首位，可在线查看也可按日期调用接口。",
  path: "/almanac",
};

export const metadata = createPageMetadata(seo);

export default function Almanac() {
  return <ClientComponent title={seo.title} />;
}
