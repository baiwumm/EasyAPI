/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-15 17:23:32
 * @Description: 首页
 */
import HomeContent from '@/components/HomeContent'
import { fetchHomeData } from '@/lib/server/home'

// 每次访问拉取最新数据，保证后台变更即时生效（后续可优化为 ISR/tag 缓存）
export const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await fetchHomeData()
  return <HomeContent data={data} />
}
