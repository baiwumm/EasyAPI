import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 17:56:43
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 09:59:29
 * @Description: 密码强度检测
 */

const seo = {
  title: "密码强度检测",
  description:
    "密码强度检测：基于 zxcvbn（支持中文字典）评估密码强度，返回评分、破解耗时估算与改进建议，密码不落访问日志。",
  path: "/password-strength",
};

export const metadata = createPageMetadata(seo);

export default function PasswordStrength() {
  return (
    <ToolPage seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
