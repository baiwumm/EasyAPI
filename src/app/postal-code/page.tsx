import ClientComponent from "./ClientComponent";

import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 11:15:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 11:15:29
 * @Description: 邮政编码查询
 */

const seo = {
  title: "邮政编码查询",
  description:
    "邮政编码双向查询：支持邮编查地区、地区名称查邮编两种方式，覆盖全国省市县，数据稳定可缓存一小时。",
  path: "/postal-code",
};

export const metadata = createPageMetadata(seo);

export default function PostalCode() {
  return <ClientComponent title={seo.title} />;
}
