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

// 一言官方句子类型白名单（与前端筛选选项一致）
const ALLOWED_TYPES = new Set([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
]);

// 长度过滤边界：防止传负数/超大值给 RPC
const MAX_LENGTH = 1000;

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const typeList = searchParams.get("type")
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

    if (
      (minLength !== null && (minLength < 0 || minLength > MAX_LENGTH)) ||
      (maxLength !== null && (maxLength < 0 || maxLength > MAX_LENGTH))
    ) {
      return NextResponse.json(
        responseMessage(
          null,
          `minLength/maxLength 必须在 0 ~ ${MAX_LENGTH} 之间`,
          RESPONSE.ERROR,
        ),
      );
    }

    if (minLength !== null && maxLength !== null && minLength > maxLength) {
      return NextResponse.json(
        responseMessage(null, "minLength 不能大于 maxLength", RESPONSE.ERROR),
      );
    }

    // type 白名单校验：未校验的值会直传 RPC
    let types: string[] | null = null;

    if (typeList) {
      if (!typeList.every((type) => ALLOWED_TYPES.has(type))) {
        return NextResponse.json(
          responseMessage(
            null,
            `type 参数不合法，可选值：${[...ALLOWED_TYPES].join("、")}`,
            RESPONSE.ERROR,
          ),
        );
      }

      types = typeList;
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
