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

const content = {
  intro:
    "密码强度检测工具：基于 zxcvbn 算法（支持中文字典）评估密码强度，返回 0~4 强度评分、四种攻击场景下的破解耗时估算与具体改进建议。密码通过 POST 请求体传输，不进 URL、不落访问日志，检测结果也不回显密码本身。",
  steps: [
    "在输入框输入或粘贴待检测的密码",
    "点击检测，查看强度评分与破解耗时估算",
    "按改进建议调整密码，直至达到目标强度",
  ],
  faqs: [
    {
      question: "为什么用 POST 而不是网址参数？",
      answer:
        "密码若放在 query string 里，会被浏览器历史记录和服务器访问日志留存；POST 请求体传输可避免这类泄露。",
    },
    {
      question: "评分 0~4 分别代表什么？",
      answer:
        "0 最弱、4 最强。zxcvbn 按破解所需猜测次数估算强度，能识别字典词、键盘模式等组合规律，比单纯的字符种类规则更准确。",
    },
    {
      question: "检测有频率限制吗？",
      answer: "同一客户端每分钟最多 20 次，超出后返回失败提示，稍后即可恢复。",
    },
  ],
  example: {
    code: 'curl -X POST "https://api.baiwumm.com/api/password-strength" -H "Content-Type: application/json" -d \'{"password":"test1234"}\'',
    label: "密码放在 JSON body 的 password 字段，最长 128 个字符。",
  },
};

export const metadata = createPageMetadata(seo);

export default function PasswordStrength() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
