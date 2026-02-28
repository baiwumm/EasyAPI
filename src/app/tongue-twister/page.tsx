/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 09:47:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 09:59:24
 * @Description: 每日绕口令
 */
import type { Metadata } from "next";

import QuoteWorld from '@/components/QuoteWorld';

export const metadata: Metadata = {
  title: '每日绕口令',
}

export default function TongueTwister() {
  return <QuoteWorld title='每日绕口令' />
}