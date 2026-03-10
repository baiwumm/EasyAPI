/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 13:47:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 13:47:52
 * @Description: 车牌归属地查询
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '车牌归属地查询',
}

export default function LicensePlate() {
  return <ClientComponent title='车牌归属地查询' />
}