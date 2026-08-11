import { NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { catchError, responseMessage } from '@/lib/utils'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 13:45:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:51:18
 * @Description: 车牌归属地查询
 */
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get('keyword')

    // 同步参数校验前置，通过后才创建客户端
    if (!keyword) {
      return NextResponse.json(responseMessage(null, '请输入查询关键字', RESPONSE.ERROR))
    }

    const supabase = await getSupabaseServerClient()

    // 按邮编查地区，返回单个对象
    const { data, error } = await supabase
      .from('ea_license_plate')
      .select('province,city,code,prefix')
      .or(`province.ilike.%${keyword}%,city.ilike.%${keyword}%,prefix.ilike.%${keyword}%`)

    if (error) {
      return NextResponse.json(responseMessage(null, '未找到相关车牌归属地信息', RESPONSE.ERROR))
    }

    return NextResponse.json(responseMessage(data))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
