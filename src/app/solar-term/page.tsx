import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-05 09:37:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-05 09:37:52
 * @Description: 二十四节气
 */

const seo = {
  title: "二十四节气",
  description:
    "二十四节气查询：按年份返回全部节气及公历交节时间（1900~2100 年），适合日历、黄历与文化类应用。",
  path: "/solar-term",
};

export const metadata = createPageMetadata(seo);

export default function SolarTerm() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
