import Image from 'next/image'

import CopyText from '@/components/CopyText'
import { getBingWallpaper } from '@/lib/server/bing-wallpaper'
import { getUrl } from '@/lib/utils'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:42:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-02 14:11:14
 * @Description: bind 每日壁纸
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'bind 每日壁纸',
}

// 每日壁纸一天内不变，页面级 ISR 缓存 24 小时
export const revalidate = 86400

export default async function BingWallpaper() {
  // 模块级缓存：每日壁纸一天内不变，避免每次访问重复请求 Bing
  const wallpaper = await getBingWallpaper()

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      <h1 className="text-2xl font-black shrink-0">bind 每日壁纸</h1>
      <div className="relative flex-1 w-full h-full">
        <Image alt={wallpaper.title} fill src={getUrl(wallpaper.url)} className="object-cover rounded-2xl" />
      </div>
      <div className="flex justify-center shrink-0">
        <CopyText content={wallpaper.url} />
      </div>
    </div>
  )
}
