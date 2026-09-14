import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { catchError, responseMessage } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-27 09:47:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:48:49
 * @Description: 每日一言
 */

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const types = searchParams.get("type")
      ? searchParams.get("type")!.split(",")
      : null;

    const minLength = searchParams.get("minLength")
      ? Number(searchParams.get("minLength"))
      : null;

    const maxLength = searchParams.get("maxLength")
      ? Number(searchParams.get("maxLength"))
      : null;

    const format = searchParams.get("format");

    // 同步参数校验前置，通过后才创建客户端
    if (
      (minLength !== null && Number.isNaN(minLength)) ||
      (maxLength !== null && Number.isNaN(maxLength))
    ) {
      return NextResponse.json(
        responseMessage(null, "minLength/maxLength 必须是数字", RESPONSE.ERROR),
      );
    }

    const supabase = await getSupabaseServerClient();

    // 调用接口
    const { data, error } = await supabase.rpc("get_random_hitokoto", {
      types,
      minlength: minLength,
      maxlength: maxLength,
    });

    // 执行失败
    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    // 数据为空（表空/RPC 无返回）时 text 分支会崩，统一返回业务错误
    if (!data) {
      return NextResponse.json(
        responseMessage(null, "暂无数据", RESPONSE.ERROR),
      );
    }

    // 返回 text 格式
    if (format === "text") {
      return new NextResponse(data.content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
