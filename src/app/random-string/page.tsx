import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:18:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 09:05:28
 * @Description: 随机字符串
 */

const seo = {
  title: "随机字符串",
  description:
    "随机字符串生成器：密码学安全的随机串，支持字母数字、URL 安全、hex 等七种类型或自定义字符集。",
  path: "/random-string",
};

export const metadata = createPageMetadata(seo);

export default function RandomString() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
