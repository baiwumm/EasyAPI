/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:27:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:42:15
 * @Description: 中文诗词
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '中文诗词',
}

export default function ChinesePoetry() {
  return <ClientComponent />
}