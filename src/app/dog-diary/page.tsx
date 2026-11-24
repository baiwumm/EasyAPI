import QuoteWorld from "@/components/QuoteWorld";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:02:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 17:02:31
 * @Description: 舔狗日记
 */

const seo = {
  title: "舔狗日记",
  description:
    "舔狗日记随机生成器：随机返回一段卑微又好笑的舔狗独白，支持纯文本直出，整活文案素材库。",
  path: "/dog-diary",
};

export const metadata = createPageMetadata(seo);

export default function DogDiary() {
  return <QuoteWorld title={seo.title} />;
}
