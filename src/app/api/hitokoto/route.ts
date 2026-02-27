/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-27 09:47:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 09:54:09
 * @Description: 每日一言
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

/**
 * @description: 查询接口列表
 * @param {Request} request
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const types = searchParams.get('type')
      ? searchParams.get('type')!.split(',')
      : null

    const minLength = searchParams.get('minLength')
      ? Number(searchParams.get('minLength'))
      : null

    const maxLength = searchParams.get('maxLength')
      ? Number(searchParams.get('maxLength'))
      : null

    const format = searchParams.get('format')

    // 调用接口
    const { data, error } = await supabase.rpc('get_random_hitokoto', {
      types,
      minlength: minLength,
      maxlength: maxLength,
    })

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

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}