import { NextResponse } from 'next/server'

import { getBingWallpaper } from '@/lib/server/bing-wallpaper'
import { catchError, get4kUrl, getUrl, responseMessage } from '@/lib/utils'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:38:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-02 14:08:23
 * @Description: bind 每日壁纸
 */
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format')

    // 模块级缓存：每日壁纸一天内不变，避免重复请求 Bing
    const wallpaper = await getBingWallpaper()

    const result = {
      url: getUrl(wallpaper.url),
      url_4k: get4kUrl(wallpaper.url),
      title: wallpaper.title,
      copyright: wallpaper.copyright,
    }

    // 返回 text 格式
    if (format === 'text') {
      return new NextResponse(getUrl(wallpaper.url), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    return NextResponse.json(responseMessage(result))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
