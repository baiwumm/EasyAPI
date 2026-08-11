import Image from 'next/image'

import CopyText from '@/components/CopyText'
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

export default async function BingWallpaper() {
  const res = await fetch(
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
  )
  if (!res.ok) {
    throw new Error(`Failed to fetch Bing wallpaper: ${res.status}`)
  }
  const body = await res.json()

  const img = body.images?.[0]
  if (!img) {
    throw new Error('No wallpaper found')
  }
  const url = `https://bing.com${img.url}`
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      <h1 className="text-2xl font-black shrink-0">bind 每日壁纸</h1>
      <div className="relative flex-1 w-full h-full">
        <Image alt={img.title} fill src={getUrl(url)} className="object-cover rounded-2xl" />
      </div>
      <div className="flex justify-center shrink-0">
        <CopyText content={url} />
      </div>
    </div>
  )
}
