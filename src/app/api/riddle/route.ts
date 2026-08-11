/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:04:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:05:10
 * @Description: 歇后语
 */
import { NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { catchError, pick, responseMessage } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    // 调用接口
    const { data, error } = await supabase.rpc('get_random_riddle')

    // 执行失败
    if (error) {
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR))
    }

    return NextResponse.json(responseMessage(pick(data, ['riddle', 'answer'])))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
