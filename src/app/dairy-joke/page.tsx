import QuoteWorld from '@/components/QuoteWorld'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 10:25:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 10:26:01
 * @Description: 每日笑话
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '每日笑话',
}

export default function DairyJoke() {
  return <QuoteWorld title="每日笑话" />
}
