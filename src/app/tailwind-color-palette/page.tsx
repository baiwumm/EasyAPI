/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-16 11:11:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-16 11:12:05
 * @Description: Tailwind 色板生成器
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: 'Tailwind 色板生成器',
}

export default function TailwindColorPalette() {
  return <ClientComponent title='Tailwind 色板生成器' />
}