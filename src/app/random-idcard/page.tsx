import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-11 15:48:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 15:48:26
 * @Description: 随机身份证号
 */

const seo = {
  title: "随机身份证号",
  description:
    "随机身份证号生成器：生成符合校验规则的 18 位测试身份证号，仅供开发测试使用，不得用于实名场景。",
  path: "/random-idcard",
};

export const metadata = createPageMetadata(seo);

export default function RandomIdCard() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
