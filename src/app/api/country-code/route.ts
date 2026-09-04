import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { catchError, responseMessage } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 15:18:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:47:25
 * @Description: 国际区号查询
 */

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");

    // 同步参数校验前置，通过后才创建客户端
    if (!keyword) {
      return NextResponse.json(
        responseMessage(null, "请输入查询关键字", RESPONSE.ERROR),
      );
    }

    const supabase = await getSupabaseServerClient();

    // 按邮编查地区，返回单个对象
    const { data, error } = await supabase
      .from("ea_country_code")
      .select("englishName,name,countryCode,phoneCode")
      .or(`name.ilike.%${keyword}%,phoneCode.ilike.%${keyword}%`);

    if (error) {
      return NextResponse.json(
        responseMessage(null, "未找到相关国际区号信息", RESPONSE.ERROR),
      );
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
