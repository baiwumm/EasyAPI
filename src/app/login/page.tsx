import type { Metadata } from "next";

import ClientComponent from "./ClientComponent";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 14:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 09:25:29
 * @Description: 登录页
 */

export const metadata: Metadata = {
  title: "用户登录",
};

export default function Login() {
  return <ClientComponent />;
}
