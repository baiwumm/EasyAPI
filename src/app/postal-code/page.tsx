import ClientComponent from './ClientComponent'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 11:15:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 11:15:29
 * @Description: 邮政编码查询
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '邮政编码查询',
}

export default function PostalCode() {
  return <ClientComponent title="邮政编码查询" />
}
