/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 16:44:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 16:44:35
 * @Description: 土味情话
 */
import type { Metadata } from "next";

import QuoteWorld from '@/components/QuoteWorld';

export const metadata: Metadata = {
  title: '土味情话',
}

export default function LoveWords() {
  return <QuoteWorld title='土味情话' />
}