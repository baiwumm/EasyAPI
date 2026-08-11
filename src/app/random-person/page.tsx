import ClientComponent from './ClientComponent'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 13:44:36
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 13:45:01
 * @Description: 随机人物
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '随机人物',
}

export default function RandomPerson() {
  return <ClientComponent title="随机人物" />
}
