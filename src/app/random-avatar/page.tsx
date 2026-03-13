/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-09 09:25:03
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 09:41:58
 * @Description: 随机头像
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '随机头像',
}

export default function RandomAvatar() {
  return <ClientComponent title='随机头像' />
}