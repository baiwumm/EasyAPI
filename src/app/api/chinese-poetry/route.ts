import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { dbErrorResponse } from "@/lib/server/api-helpers";
import { catchError, responseMessage } from "@/lib/utils";

// 作者名上限：不设上限时一个超长 author 会被原样塞进 RPC 参数
const MAX_AUTHOR_LENGTH = 20;

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:23:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:44:08
 * @Description: 飞花令
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const author = searchParams.get("author");

    if (author && author.length > MAX_AUTHOR_LENGTH) {
      return NextResponse.json(
        responseMessage(
          null,
          `参数 author 长度不能超过 ${MAX_AUTHOR_LENGTH} 个字符`,
          RESPONSE.ERROR,
        ),
      );
    }

    // 调用接口
    const { data, error } = await supabase.rpc("get_random_chinese_poetry", {
      author_param: author,
    });

    // 执行失败
    if (error) {
      return dbErrorResponse(error, "get_random_chinese_poetry");
    }

    // RPC 无匹配结果时直接 responseMessage(null)，包装后是 code:200 + data:null，
    // 违背「失败 ⇒ code:500、data 为 null」的响应体约定
    if (!data) {
      return NextResponse.json(
        responseMessage(null, "暂无数据", RESPONSE.ERROR),
      );
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
