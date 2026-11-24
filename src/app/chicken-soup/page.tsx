import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 16:56:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 16:58:26
 * @Description: 毒鸡汤
 */

const seo = {
  title: "毒鸡汤",
  description:
    "毒鸡汤随机生成器：随机来一发扎心毒鸡汤语录，支持纯文本直出与接口调用，朋友圈段子与整活文案素材。",
  path: "/chicken-soup",
};

export const metadata = createPageMetadata(seo);

export default function ChickenSoup() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld title={seo.title} />
    </ToolPage>
  );
}
