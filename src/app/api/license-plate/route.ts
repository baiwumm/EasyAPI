import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { catchError, responseMessage, sanitizeLikeKeyword } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 13:45:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:51:18
 * @Description: 车牌归属地查询
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
      .from("ea_license_plate")
      .select("province,city,code,prefix")
      .or(
        `province.ilike.%${sanitizeLikeKeyword(keyword)}%,city.ilike.%${sanitizeLikeKeyword(keyword)}%,prefix.ilike.%${sanitizeLikeKeyword(keyword)}%`,
      );

    // 数据库错误如实返回（此前与查空混用同一文案，误导排查）
    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    // 字典表基本只读，短缓存 + 后台刷新减轻 Supabase 压力
    return NextResponse.json(responseMessage(data), {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
