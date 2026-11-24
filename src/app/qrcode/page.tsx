import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 15:16:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 15:17:29
 * @Description: 生成二维码
 */

const seo = {
  title: "生成二维码",
  description:
    "在线二维码生成器：输入网址或文本即时生成二维码，支持 PNG、SVG 与 Base64 输出及自定义尺寸，并提供免费生成接口。",
  path: "/qrcode",
};

export const metadata = createPageMetadata(seo);

export default function Qrcode() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
