import QuoteWorld from "@/components/QuoteWorld";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:22:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 14:22:27
 * @Description: 今日诗词
 */

const seo = {
  title: "今日诗词",
  description:
    "今日诗词：每天推荐一句诗词并附出处与作者，一天内结果不变，适合日记、签名档与每日打卡场景。",
  path: "/diary-poetry",
};

export const metadata = createPageMetadata(seo);

export default function DiaryPoetry() {
  return (
    <QuoteWorld formWhoField="author" fromField="origin" title={seo.title} />
  );
}
