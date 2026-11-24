import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 09:02:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 09:03:09
 * @Description: IP 归属地查询
 */

const seo = {
  title: "IP 归属地查询",
  description:
    "IP 归属地查询：查询 IPv4/IPv6 的地理位置与运营商信息，不传 IP 自动识别请求来源，支持在线查询与接口调用。",
  path: "/ip-region",
};

export const metadata = createPageMetadata(seo);

export default function IpRegion() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
