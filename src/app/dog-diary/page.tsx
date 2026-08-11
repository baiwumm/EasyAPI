import QuoteWorld from '@/components/QuoteWorld'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:02:02
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 17:02:31
 * @Description: 舔狗日记
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '舔狗日记',
}

export default function DogDiary() {
  return <QuoteWorld title="舔狗日记" />
}
