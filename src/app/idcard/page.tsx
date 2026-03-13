/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:34:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 16:35:08
 * @Description: 身份证信息查询
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '身份证信息查询',
}

export default function Idcard() {
  return <ClientComponent title='身份证信息查询' />
}