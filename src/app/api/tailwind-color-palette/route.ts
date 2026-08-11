import { NextResponse } from 'next/server'
import tinycolor from 'tinycolor2'
import { getTailwindColors } from 'uicolors-generator'

import { RESPONSE } from '@/enums'
import { catchError, responseMessage } from '@/lib/utils'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-16 10:52:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-16 11:07:58
 * @Description: Tailwind 色板生成器
 */
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = request.nextUrl
    // 参数处理
    const c = searchParams.get('color')?.trim() || '' // 需要生成的颜色，支持hex、rgb、hsl、hsv格式
    const color = tinycolor(c)

    // 参数校验
    if (!color || !color.isValid()) {
      return NextResponse.json(responseMessage(null, '参数 color 不合法', RESPONSE.ERROR))
    }

    const palette = getTailwindColors(color.toHexString(), {
      asHex: true,
    })

    return NextResponse.json(responseMessage({
      color: color.toHexString(),
      palette,
    }))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
