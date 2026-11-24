import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 15:16:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 15:17:29
 * @Description: 生成条形码
 */

const seo = {
  title: "生成条形码",
  description:
    "在线条形码生成器：支持 CODE128、CODE39、EAN13、UPC 等十种编码格式，可输出 SVG 或 PNG，自定义线宽、颜色与文字样式。",
  path: "/barcode",
};

export const metadata = createPageMetadata(seo);

export default function Barcode() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
