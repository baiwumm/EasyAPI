import ClientComponent from "./ClientComponent";

import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 09:02:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 09:03:09
 * @Description: IP 归属地查询
 */

const seo = {
  title: "IP 归属地查询",
  description:
    "IP 归属地查询：查询 IPv4/IPv6 的地理位置与运营商信息，不传 IP 自动识别请求来源，支持在线查询与接口调用。",
  path: "/ip-region",
};

const content = {
  intro:
    "IP 归属地查询工具：查询任意 IPv4/IPv6 地址的地理位置与运营商信息（数据来自 ip-api.com），返回国家、省市、邮编、经纬度、时区与运营商等字段；不传 IP 参数时自动识别当前请求来源，适合风控、日志分析与场景化运营。",
  steps: [
    "直接打开页面，自动显示当前来源 IP 的归属地",
    "或在输入框填入要查询的 IPv4 / IPv6 地址",
    "查看国家、省市、运营商、经纬度等归属地详情",
  ],
  faqs: [
    {
      question: "不输入 IP 会查询谁？",
      answer:
        "自动使用当前请求的来源 IP。该模式下的响应按来源区分、不做公共缓存；显式传入 IP 的查询结果则可长期缓存。",
    },
    {
      question: "定位精度如何？",
      answer:
        "精确到城市级，数据来自 ip-api.com 公开服务，移动网络与代理 IP 可能存在偏差，不保证 100% 准确。",
    },
    {
      question: "支持 IPv6 吗？",
      answer:
        "支持，IPv4 与 IPv6 地址均可查询，解析失败时接口会返回失败状态与原因。",
    },
  ],
  example: {
    code: 'curl "https://api.baiwumm.com/api/ip-region?ip=8.8.8.8"',
  },
};

export const metadata = createPageMetadata(seo);

export default function IpRegion() {
  return (
    <ToolPage content={content} seo={seo}>
      <ClientComponent title={seo.title} />
    </ToolPage>
  );
}
