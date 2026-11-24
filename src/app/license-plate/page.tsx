import ClientComponent from "./ClientComponent";

import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 13:47:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 13:47:52
 * @Description: 车牌归属地查询
 */

const seo = {
  title: "车牌归属地查询",
  description:
    "车牌归属地查询：按省份、城市或车牌前缀（如粤B）模糊查询，返回归属地与行政区划代码，数据稳定可缓存一小时。",
  path: "/license-plate",
};

export const metadata = createPageMetadata(seo);

export default function LicensePlate() {
  return <ClientComponent title={seo.title} />;
}
