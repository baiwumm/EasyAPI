/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 16:42:18
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 16:42:53
 * @Description: 土味情话
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { pick, responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format')

    // 调用接口
    const { data, error } = await supabase.rpc('get_random_love_words');

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

    return NextResponse.json(responseMessage(pick(data, ['content'])));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}