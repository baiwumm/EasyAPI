import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 15:20:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 15:21:06
 * @Description: 国际区号查询
 */

const seo = {
  title: "国际区号查询",
  description:
    "国际电话区号查询：按国家或地区中文名、电话区号模糊搜索，返回国家代码与区号，数据稳定可缓存一小时。",
  path: "/country-code",
};

export const metadata = createPageMetadata(seo);

export default function CountryCode() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
