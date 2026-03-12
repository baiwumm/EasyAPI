/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 13:45:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:51:18
 * @Description: 车牌归属地查询
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { catchError, responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json(responseMessage(null, '请输入查询关键字', RESPONSE.ERROR))
    }

    // 按邮编查地区，返回单个对象
    const { data, error } = await supabase
      .from("ea_license_plate")
      .select('province,city,code,prefix')
      .or(`province.ilike.%${keyword}%,city.ilike.%${keyword}%,prefix.ilike.%${keyword}%`)

    if (error) {
      return NextResponse.json(responseMessage(null, '未找到相关车牌归属地信息', RESPONSE.ERROR))
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}