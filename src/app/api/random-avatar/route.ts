/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 17:33:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 17:56:26
 * @Description:
 */
import {
  adventurer,
  avataaars,
  bottts,
  funEmoji,
  lorelei,
  micah,
  notionists,
  openPeeps,
  personas,
  pixelArt,
  thumbs,
} from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { faker } from '@faker-js/faker'
import { NextResponse } from 'next/server'

import { AVATAR_STYLES } from '@/enums'
import { catchError, clamp, responseMessage } from '@/lib/utils'

import type { Style } from '@dicebear/core'
import type { NextRequest } from 'next/server'

/**
 * style -> dicebear style
 */
const STYLE_MAP: Record<string, Style<any>> = {
  adventurer,
  avataaars,
  bottts,
  pixelArt,
  funEmoji,
  lorelei,
  micah,
  notionists,
  openPeeps,
  personas,
  thumbs,
}

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const params = request.nextUrl.searchParams

    /**
     * 参数
     */
    const styleParam = (params.get('style') || AVATAR_STYLES.ADVENTURER) as typeof AVATAR_STYLES.values[number]
    const seedParam = params.get('seed')

    /**
     * 参数限制
     */
    const count = clamp(parseInt(params.get('count') || '1'), 1, 20)
    const size = clamp(parseInt(params.get('size') || '128'), 16, 512)

    /**
     * style 校验
     */
    let styleValue = AVATAR_STYLES.values.includes(styleParam)
      ? styleParam
      : AVATAR_STYLES.ADVENTURER

    /**
     * random 风格
     */
    if (styleValue === AVATAR_STYLES.RANDOM) {
      styleValue = faker.helpers.arrayElement(
        Object.keys(STYLE_MAP),
      ) as typeof styleParam
    }

    const style = STYLE_MAP[styleValue]

    /**
     * 多个头像 → 返回 URL 数组
     */
    if (count > 1) {
      const baseUrl = request.nextUrl.origin

      const urls = Array.from({ length: count }, () => {
        const seed = faker.string.uuid()
        return `${baseUrl}/api/random-avatar?seed=${seed}&size=${size}&style=${styleValue}`
      })

      return NextResponse.json(responseMessage(urls))
    }

    /**
     * 单个头像
     */
    const seed = seedParam || crypto.randomUUID()

    const avatar = createAvatar(style, {
      seed,
      size,
    })

    /**
     * SVG
     */
    const svg = avatar.toString()

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
