import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 13:47:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 13:48:25
 * @Description: 颜色转换
 */

const seo = {
  title: "颜色转换",
  description:
    "在线颜色转换工具：任意颜色值一键转换为 hex、rgb、hsl、hsv 四种格式，支持 CSS 颜色名，前端开发取色必备。",
  path: "/color-conversion",
};

export const metadata = createPageMetadata(seo);

export default function ColorConversion() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
