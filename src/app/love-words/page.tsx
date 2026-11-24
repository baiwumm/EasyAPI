import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 16:44:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 16:44:35
 * @Description: 土味情话
 */

const seo = {
  title: "土味情话",
  description:
    "土味情话随机生成器：随机来一句甜到腻的情话文案，支持纯文本直出与接口调用，表白撩人素材库。",
  path: "/love-words",
};

export const metadata = createPageMetadata(seo);

export default function LoveWords() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld title={seo.title} />
    </ToolPage>
  );
}
