/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 13:47:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 13:48:25
 * @Description: 颜色转换
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '颜色转换',
}

export default function ColorConversion() {
  return <ClientComponent title='颜色转换' />
}