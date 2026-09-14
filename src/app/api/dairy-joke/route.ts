import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { randomTextResponse } from "@/lib/server/api-helpers";
import { catchError } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 10:23:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:47:39
 * @Description: 每日笑话
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;

    // 文案类统一模板：RPC 随机取数 + format=text 直出 + JSON 白名单字段
    return await randomTextResponse(
      supabase,
      "get_random_dairy_joke",
      searchParams.get("format"),
    );
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
