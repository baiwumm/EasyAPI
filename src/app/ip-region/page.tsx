/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 09:02:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 09:03:09
 * @Description: IP 归属地查询
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: 'IP 归属地查询',
}

export default function IpRegion() {
  return <ClientComponent />
}