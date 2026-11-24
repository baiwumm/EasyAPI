import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 11:12:16
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 11:12:34
 * @Description: 随机颜色
 */

const seo = {
  title: "随机颜色",
  description:
    "随机颜色生成器：一次生成多个随机颜色，同时返回 hex、rgb、hsl、hsv 四种格式，适合设计取色与测试数据。",
  path: "/random-color",
};

export const metadata = createPageMetadata(seo);

export default function RandomColor() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
