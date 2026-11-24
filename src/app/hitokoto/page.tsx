import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-26 18:08:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 09:23:59
 * @Description: 每日一言
 */

const seo = {
  title: "每日一言",
  description:
    "每日一言 API 与在线页面：随机返回动画、文学、诗词、网易云等类型的句子，支持按类型与长度筛选，可纯文本直出。",
  path: "/hitokoto",
};

const content = {
  intro:
    "每日一言工具随机返回一条句子，覆盖动画、漫画、游戏、文学、原创、诗词、网易云、哲学等 12 种类型，支持按类型与长度筛选，是签名档、打卡应用与文案素材的常用数据源。",
  steps: [
    "选择句子类型标签（可多选，不选则全部随机）",
    "点击「换一句」获取新句子，打字动画展示完整句子",
    "复制句子内容，或直接调用接口获取",
  ],
  faqs: [
    {
      question: "支持哪些句子类型？",
      answer:
        "动画、漫画、游戏、文学、原创、网络、其他、影视、诗词、网易云、哲学、抖机灵共 12 类，可组合筛选。",
    },
    {
      question: "如何只返回纯文本？",
      answer:
        "接口加 format=text 参数即可直接返回句子文本（text/plain），不带 JSON 响应壳，方便接入签名档等场景。",
    },
    {
      question: "句子可以商用吗？",
      answer:
        "句子来自公开投稿与网络收集，仅供个人与非商业场景使用；引用时请注意原作版权。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/hitokoto?type=i,d&minLength=10&maxLength=50"',
    label: "type 可多选（逗号分隔），minLength / maxLength 范围 0~1000。",
  },
};

export const metadata = createPageMetadata(seo);

export default function Hitokoto() {
  return (
    <ToolPage content={content} seo={seo}>
      <QuoteWorld mode="hitokoto" title={seo.title} />
    </ToolPage>
  );
}
