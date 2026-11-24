import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:34:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 16:35:08
 * @Description: 身份证信息查询
 */

const seo = {
  title: "身份证信息查询",
  description:
    "身份证信息查询：解析 18 位身份证号，返回籍贯、性别、年龄、星座与校验结果，仅供合法合规场景使用。",
  path: "/idcard",
};

const content = {
  intro:
    "身份证信息查询工具：解析 18 位居民身份证号，返回合法性校验结果、籍贯（省/市/区）、性别、年龄与星座，适合表单校验、测试数据清洗等开发场景。请勿查询他人身份证号，仅供合法合规使用。",
  steps: [
    "输入 18 位身份证号",
    "点击查询",
    "查看籍贯、性别、年龄、星座与合法性校验结果",
  ],
  faqs: [
    {
      question: "查询结果包含哪些信息？",
      answer:
        "校验是否合法、性别、省市县三级籍贯（含行政区划代码）、周岁年龄、星座，以及证件类型（大陆 / 港澳台）。",
    },
    {
      question: "支持港澳台证件号吗？",
      answer:
        "返回结果含证件类型字段，可区分大陆（1）与港澳台（2）证件，解析内容以实际返回为准。",
    },
    {
      question: "查询是实时的吗？",
      answer:
        "是。身份证号按规则实时解析，行政区划信息来自标准字典数据；本工具仅供开发与合规场景使用。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/idcard?id=<18位身份证号>"',
    label:
      "id 为必填的 18 位身份证号；测试可先到「随机身份证号」页面生成测试号码。",
  },
};

export const metadata = createPageMetadata(seo);

export default function Idcard() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
