import ClientComponent from "./ClientComponent";

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

export const metadata = createPageMetadata(seo);

export default function Holiday() {
  return <ClientComponent title={seo.title} />;
}
