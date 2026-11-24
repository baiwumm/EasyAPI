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

export const metadata = createPageMetadata(seo);

export default function Bmi() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
