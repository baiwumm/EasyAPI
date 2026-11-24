import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 18:02:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 18:03:18
 * @Description: BMI 计算器
 */

const seo = {
  title: "BMI 计算器",
  description:
    "在线 BMI 计算器：输入身高体重即刻得出 BMI 指数与体重状态（过低/正常/超重/肥胖），并提供免费查询接口。",
  path: "/bmi",
};

const content = {
  intro:
    "BMI（Body Mass Index，身体质量指数）是国际通用的体重健康评估指标，计算方式为体重（千克）除以身高（米）的平方。本工具输入身高体重即可得出 BMI 指数，并按「体重过低 / 正常体重 / 超重 / 肥胖」四档给出体重状态。",
  steps: [
    "输入身高（单位：厘米）",
    "输入体重（单位：千克）",
    "点击开始计算，查看 BMI 指数与对应的体重状态",
  ],
  faqs: [
    {
      question: "BMI 的计算公式是什么？",
      answer:
        "BMI = 体重 ÷ 身高²。例如身高 175 厘米、体重 65 千克：65 ÷ 1.75² ≈ 21.22，属于正常体重范围。",
    },
    {
      question: "BMI 多少算正常？",
      answer:
        "本工具采用通用分级标准：18.5 以下为体重过低，18.5~24.9 为正常体重，24.9~29.9 为超重，29.9 及以上为肥胖。不同国家与机构的标准略有差异，结果仅供健康管理参考。",
    },
    {
      question: "BMI 对所有人都适用吗？",
      answer:
        "不适用。肌肉发达者可能被误判为超重；孕妇、儿童与老年人建议使用专门的标准进行评估，BMI 仅作为一般成年人的初步参考。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/bmi?height=175&weight=65"',
    label: "身高体重为必填参数：height 0~300 厘米，weight 0~500 千克。",
  },
};

export const metadata = createPageMetadata(seo);

export default function Bmi() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
