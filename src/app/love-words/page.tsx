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

const content = {
  intro:
    "土味情话随机生成器：每次随机返回一句甜到腻的情话文案，支持一键复制、纯文本直出与接口调用，适合表白、朋友圈文案与日常聊天素材。",
  steps: [
    "点击「换一句」随机抽取情话",
    "点击复制文案",
    "发给想撩的人，或直接调用接口接入自己的应用",
  ],
  faqs: [
    {
      question: "文案可以商用吗？",
      answer: "文案来自网络收集，仅供个人娱乐与非商业场景使用。",
    },
    {
      question: "支持纯文本接口吗？",
      answer:
        "支持。接口加 format=text 参数即可直接返回情话正文（text/plain），方便接入机器人或签名档。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/love-words?format=text"',
  },
};

export const metadata = createPageMetadata(seo);

export default function LoveWords() {
  return (
    <ToolPage content={content} seo={seo}>
      <QuoteWorld title={seo.title} />
    </ToolPage>
  );
}
