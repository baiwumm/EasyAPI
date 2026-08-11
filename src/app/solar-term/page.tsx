import ClientComponent from './ClientComponent'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-05 09:37:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-05 09:37:52
 * @Description: 二十四节气
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '二十四节气',
}

export default function SolarTerm() {
  return <ClientComponent title="二十四节气" />
}
