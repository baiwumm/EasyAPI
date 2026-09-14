import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { randomTextResponse } from "@/lib/server/api-helpers";
import { catchError } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:52:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:48:21
 * @Description: 舔狗日记
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;

    // 文案类统一模板：RPC 随机取数 + format=text 直出 + JSON 白名单字段
    return await randomTextResponse(
      supabase,
      "get_random_dog_diary",
      searchParams.get("format"),
    );
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
