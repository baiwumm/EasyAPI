/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 16:01:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 16:02:36
 * @Description: 法定节假日
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '法定节假日',
}

export default function Holiday() {
  return <ClientComponent title='法定节假日' />
}