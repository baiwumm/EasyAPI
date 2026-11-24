import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 16:01:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 16:02:36
 * @Description: 法定节假日
 */

const seo = {
  title: "法定节假日",
  description:
    "法定节假日查询：按年份返回全年放假安排、调休上班日期、假期天数与剩余余额，适合日历、考勤与出行规划。",
  path: "/holiday",
};

const content = {
  intro:
    "法定节假日查询工具：按年份返回中国全年法定假期列表，包含假期名称、起止日期、放假天数、调休上班日期、距今天数与假期余额，适合日历、考勤、出行规划等应用场景。",
  steps: [
    "选择或输入年份（2022 至当前年份）",
    "查看全年假期列表：起止日期、天数、调休与余额",
    "复制假期信息，或直接调用接口获取结构化数据",
  ],
  faqs: [
    {
      question: "支持查询哪些年份？",
      answer:
        "支持 2022 年至今。国务院通常在上一年底公布次年安排，超出范围的年份会自动钳制到边界值，未来年份以官方公布为准。",
    },
    {
      question: "「假期余额」是什么意思？",
      answer:
        "未开始的假期显示总天数，进行中的假期显示剩余天数，已结束的假期为 0，方便一眼看出今年还剩哪些假。",
    },
    {
      question: "调休上班日会标注吗？",
      answer:
        "会。每个假期项都带调休上班日期列表，接口字段为 work 数组，可直接用于考勤系统。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/holiday?year=2026"',
    label: "year 可省略（默认当前年份），非数字值会静默回退为当前年份。",
  },
};

export const metadata = createPageMetadata(seo);

export default function Holiday() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
