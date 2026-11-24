import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 11:15:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 11:15:29
 * @Description: 邮政编码查询
 */

const seo = {
  title: "邮政编码查询",
  description:
    "邮政编码双向查询：支持邮编查地区、地区名称查邮编两种方式，覆盖全国省市县，数据稳定可缓存一小时。",
  path: "/postal-code",
};

const content = {
  intro:
    "邮政编码双向查询工具：支持「邮编查地区」与「地区查邮编」两种方式——按邮编精确查询归属省市区，或按地区名称模糊查询邮编（最多返回 20 条），覆盖全国行政区划数据。",
  steps: [
    "选择查询方式：邮编查地区 / 地区查邮编",
    "输入 6 位邮政编码或省、市、区名称",
    "查看匹配结果：省份、城市、区县、区号与邮编",
  ],
  faqs: [
    {
      question: "支持模糊查询吗？",
      answer:
        "支持。地区查邮编模式按名称模糊匹配，最多返回 20 条结果；邮编查地区模式为精确匹配，返回单个对象。",
    },
    {
      question: "数据会更新吗？",
      answer:
        "行政区划与邮编字典数据基本不变，接口响应可缓存一小时；若行政区划调整，以接口返回的最新字典为准。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/postal-code?type=2&keyword=深圳"',
    label: "type=1 邮编查地区（默认），type=2 地区查邮编；keyword 必填。",
  },
};

export const metadata = createPageMetadata(seo);

export default function PostalCode() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
