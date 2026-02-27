/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-26 18:08:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 09:23:59
 * @Description: 每日一言
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '每日一言',
}

export default function Hitokoto() {
  return <ClientComponent />
}