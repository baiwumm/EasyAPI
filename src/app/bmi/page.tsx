import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 18:02:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 18:03:18
 * @Description: BMI 计算器
 */

export const metadata: Metadata = {
  title: "BMI 计算器",
};

export default function Bmi() {
  return <ClientComponent title="BMI 计算器" />;
}
