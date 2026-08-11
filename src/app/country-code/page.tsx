import ClientComponent from './ClientComponent'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 15:20:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 15:21:06
 * @Description: 国际区号查询
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '国际区号查询',
}

export default function CountryCode() {
  return <ClientComponent title="国际区号查询" />
}
