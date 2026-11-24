import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 13:44:36
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 13:45:01
 * @Description: 随机人物
 */

const seo = {
  title: "随机人物",
  description:
    "随机人物肖像 API：返回人物肖像图片地址，支持性别与尺寸参数（32~512px），可批量生成，适合测试数据。",
  path: "/random-person",
};

export const metadata = createPageMetadata(seo);

export default function RandomPerson() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
