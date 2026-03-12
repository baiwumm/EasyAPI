/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 11:07:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 11:13:48
 * @Description: 邮政编码查询
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
    const type = Number(searchParams.get('type') || 1); // 1：根据邮编查地区，2：根据地区查邮编
    const keyword = searchParams.get('keyword'); // 1：邮政编码，2：地区名称（模糊查询）

    if (!keyword) {
      return NextResponse.json(responseMessage(null, '请输入查询关键字', RESPONSE.ERROR))
    }

    let data;
    const selectFields = 'province,city,area,areaCode,postCode';

    if (type === 1) {
      // 按邮编查地区，返回单个对象
      const { data: res, error } = await supabase
        .from("ea_postal_code")
        .select(selectFields)
        .eq("postCode", keyword)
        .limit(1)
        .single()

      if (error) {
        return NextResponse.json(responseMessage(null, '未找到相关邮政编码信息', RESPONSE.ERROR))
      }
      data = res

    } else if (type === 2) {
      // 按地区查邮编，模糊匹配多个
      const { data: res } = await supabase
        .from("ea_postal_code")
        .select(selectFields)
        .or(`province.ilike.%${keyword}%,city.ilike.%${keyword}%,area.ilike.%${keyword}%`)
        .limit(20)

      if (!res?.length) {
        return NextResponse.json(responseMessage(null, '未找到相关邮政编码信息', RESPONSE.ERROR))
      }
      data = res
    } else {
      return NextResponse.json(responseMessage(null, 'type 参数错误，只能是 1 或 2', RESPONSE.ERROR))
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}