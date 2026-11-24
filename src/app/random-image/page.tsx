import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 09:50:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 10:02:41
 * @Description: 随机图片
 */

const seo = {
  title: "随机图片",
  description:
    "随机图片 API：返回指定尺寸的真实照片地址（picsum.photos），可批量生成，适合占位图与开发测试。",
  path: "/random-image",
};

const content = {
  intro:
    "随机图片工具：单次返回多张指定尺寸的真实照片地址（图源为 picsum.photos 公开图库），数量 1~20 张、宽高 16~1024 像素可调，适合占位图、开发测试与设计稿填充。",
  steps: [
    "设置生成数量（1~20）与图片宽高（16~1024 像素）",
    "点击获取，页面以瀑布网格展示随机图片",
    "点击图片复制地址，或直接右键另存",
  ],
  faqs: [
    {
      question: "图片是真实照片还是程序生成？",
      answer:
        "真实照片，图源为 picsum.photos 的公开图库，按 seed 随机抽取，同一 seed 生成的图片固定。",
    },
    {
      question: "图片地址会失效吗？",
      answer:
        "地址指向 picsum.photos 的稳定地址，长期有效；第三方服务不可用时整页图片会挂载失败，接口会返回错误信息。",
    },
    {
      question: "能指定图片内容主题吗？",
      answer:
        "不支持按主题筛选，图库内容随机；需要人物肖像可使用随机人物工具。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/random-image?count=5&width=800&height=600"',
    label: "count 范围 1~20（默认 5），width / height 范围 16~1024 像素。",
  },
};

export const metadata = createPageMetadata(seo);

export default function RandomImage() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
