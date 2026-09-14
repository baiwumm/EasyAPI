/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-15 17:23:32
 * @Description: 首页
 */
import HomeContent from "@/components/HomeContent";
import { fetchHomeData } from "@/lib/server/home";

// ISR：首页为全站最高流量页，每 5 分钟后台再生成；
// 后台变更最迟 5 分钟生效（完整方案为后台保存时 revalidateTag，见修复报告）。
// 再生成期间返回旧页面，瞬时数据库故障也不影响首页可用性
export const revalidate = 300;

export default async function Home() {
  const data = await fetchHomeData();

  return <HomeContent data={data} />;
}
