/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 16:15:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 11:18:08
 * @Description: 头部布局
 */
import Image from 'next/image';
import ThemeMode from '@/components/ThemeMode'; // 主题切换
export default function Header() {
  return (
    <header className="sticky w-full flex gap-4 justify-between items-center top-0 h-16 shadow-md dark:shadow-[rgba(255,255,255,.15)] backdrop-blur bg-white dark:bg-transparent transition-all py-3 px-4 md:px-12 lg:px-20 z-50">
      {/* 左侧 Logo 标题 */}
      <div className="flex gap-1 justify-between items-center grow-0 shrink-0">
        <Image src="/logo.svg" alt="logo" priority width={120} height={40} />
        <h1 className="font-black text-xl hidden sm:block">{process.env.SITE_DESCRIPTION}</h1>
      </div>
      {/* 暗黑主题 */}
      <ThemeMode />
    </header>
  )
}