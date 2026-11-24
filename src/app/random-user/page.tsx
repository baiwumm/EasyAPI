import ClientComponent from "./ClientComponent";

import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 10:58:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 10:59:00
 * @Description: 随机用户
 */

const seo = {
  title: "随机用户",
  description:
    "随机用户信息生成器：生成中文姓名、手机号、邮箱、地址、公司等测试数据，支持指定性别与批量生成。",
  path: "/random-user",
};

export const metadata = createPageMetadata(seo);

export default function RandomUser() {
  return <ClientComponent title={seo.title} />;
}
