/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 10:58:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 10:59:00
 * @Description: 随机用户
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '随机用户',
}

export default function RandomUser() {
  return <ClientComponent title='随机用户' />
}