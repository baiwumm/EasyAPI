import QuoteWorld from "@/components/QuoteWorld";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:47:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:48:50
 * @Description: 骂人宝典（祖安语录）
 */

const seo = {
  title: "骂人宝典（祖安语录）",
  description:
    "祖安语录随机生成器：随机返回一条骂人宝典文案，支持纯文本直出，娱乐整活场景专用，请勿真实攻击他人。",
  path: "/swearing",
};

export const metadata = createPageMetadata(seo);

export default function Swearing() {
  return <QuoteWorld title={seo.title} />;
}
