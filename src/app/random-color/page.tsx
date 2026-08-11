import ClientComponent from './ClientComponent'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 11:12:16
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 11:12:34
 * @Description: 随机颜色
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '随机颜色',
}

export default function RandomColor() {
  return <ClientComponent title="随机颜色" />
}
