/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 16:56:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 16:58:26
 * @Description: 毒鸡汤
 */
import type { Metadata } from "next";

import QuoteWorld from '@/components/QuoteWorld';

export const metadata: Metadata = {
  title: '毒鸡汤',
}

export default function ChickenSoup() {
  return <QuoteWorld title='毒鸡汤' />
}