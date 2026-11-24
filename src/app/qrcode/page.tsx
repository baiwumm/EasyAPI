import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 15:16:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 15:17:29
 * @Description: 生成二维码
 */

const seo = {
  title: "生成二维码",
  description:
    "在线二维码生成器：输入网址或文本即时生成二维码，支持 PNG、SVG 与 Base64 输出及自定义尺寸，并提供免费生成接口。",
  path: "/qrcode",
};

const content = {
  intro:
    "在线二维码生成器：输入网址或任意文本即时生成二维码图片，支持 PNG、SVG 与 Base64 Data URL 三种输出格式，尺寸可在 64~1000 像素间自定义，并提供免费生成接口。",
  steps: [
    "输入二维码内容（网址或任意文本，最长 2000 字符）",
    "选择输出格式（PNG / SVG / Base64）与尺寸（可选）",
    "点击生成，扫码测试或下载、复制图片",
  ],
  faqs: [
    {
      question: "二维码内容最长支持多少字符？",
      answer:
        "最长 2000 个字符，超出会被截断，建议控制内容长度以保证扫码成功率。",
    },
    {
      question: "生成的二维码会过期吗？",
      answer:
        "不会。二维码是内容的编码，不依赖服务器存储——只要编码的内容（如网址）本身有效，二维码就永久可用。",
    },
    {
      question: "可以生成带 Logo 的二维码吗？",
      answer: "暂不支持自定义 Logo，当前输出为标准黑白二维码。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/qrcode?text=https://api.baiwumm.com&format=svg&size=256" -o qrcode.svg',
    label: "format 支持 png（默认）、svg、dataurl；size 范围 64~1000 像素。",
  },
};

export const metadata = createPageMetadata(seo);

export default function Qrcode() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
