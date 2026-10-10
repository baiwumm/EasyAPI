import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { dbErrorResponse, ilikeOr } from "@/lib/server/api-helpers";
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

    // 净化后复查：sanitizeLikeKeyword 会删除 , ( ) " \ 等 PostgREST or() 语法字符，
    // 纯标点关键字（如 ?keyword=,）净化后是空串，拼出的 `xx.ilike.%%` 会匹配全表，
    // 必须在这里拦掉，否则等于把整张字典表返回给调用方
    if (!sanitizeLikeKeyword(keyword)) {
      return NextResponse.json(
        responseMessage(null, "请输入有效的查询关键字", RESPONSE.ERROR),
      );
    }

    const supabase = await getSupabaseServerClient();

    // 多列模糊匹配，返回数组；limit 兜底避免未命中索引时拉全表
    const { data, error } = await supabase
      .from("ea_license_plate")
      .select("province,city,code,prefix")
      .or(ilikeOr(keyword, ["province", "city", "prefix"]))
      .limit(50);

    // 数据库错误。（原文 error.message 带表名/列名，不对外返回）
    if (error) {
      return dbErrorResponse(error, "ea_license_plate");
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
