/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:23:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:27:10
 * @Description: 中文诗词
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const author = searchParams.get('author')

    // 调用接口
    const { data, error } = await supabase
      .rpc('get_random_chinese_poetry', { author_param: author });

    // 执行失败
    if (error) {
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR))
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}