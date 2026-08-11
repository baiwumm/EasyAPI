import { NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { catchError, responseMessage } from '@/lib/utils'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 09:45:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:55:25
 * @Description: 每日绕口令
 */
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format')

    // 调用接口
    const { data, error } = await supabase.rpc('get_random_tongue_twister')

    // 执行失败
    if (error) {
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR))
    }

    // 返回 text 格式
    if (format === 'text') {
      return new NextResponse(data.content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    return NextResponse.json(responseMessage(data))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
