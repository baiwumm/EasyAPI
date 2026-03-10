/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 16:07:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 16:07:51
 * @Description: 随机表情
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '随机表情',
}

export default function RandomEmoji() {
  return <ClientComponent title='随机表情' />
}