import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-16 11:11:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-16 11:12:05
 * @Description: Tailwind 色板生成器
 */

const seo = {
  title: "Tailwind 色板生成器",
  description:
    "Tailwind 色板生成器：以任意颜色为基准生成 50~950 十一档色阶，适合前端设计系统与主题配色。",
  path: "/tailwind-color-palette",
};

export const metadata = createPageMetadata(seo);

export default function TailwindColorPalette() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
