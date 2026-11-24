import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:34:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 16:35:08
 * @Description: 身份证信息查询
 */

const seo = {
  title: "身份证信息查询",
  description:
    "身份证信息查询：解析 18 位身份证号，返回籍贯、性别、年龄、星座与校验结果，仅供合法合规场景使用。",
  path: "/idcard",
};

export const metadata = createPageMetadata(seo);

export default function Idcard() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
