/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:11:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 14:39:30
 * @Description: 随机字符串
 */
import type { Options } from "crypto-random-string";
import type { NextRequest } from "next/server";

import cryptoRandomString from "crypto-random-string";
import { NextResponse } from "next/server";

import { RANDOM_STRING_TYPES, RESPONSE } from "@/enums";
import { catchError, responseMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;

    const length = Math.min(
      Math.max(parseInt(searchParams.get("length") || "16"), 1),
      100,
    );

    const count = Math.min(
      Math.max(parseInt(searchParams.get("count") || "1"), 1),
      50,
    );

    const type = (searchParams.get("type") ||
      RANDOM_STRING_TYPES.ALPHANUMERIC) as Options["type"];
    const characters = searchParams.get("characters");

    // 官方支持的 type 列表
    const validTypes: Options["type"][] = RANDOM_STRING_TYPES.values;

    // 参数校验
    if (!characters && !validTypes.includes(type)) {
      return NextResponse.json(
        responseMessage(
          null,
          `type 参数无效，可选值：${validTypes.join("、")}`,
          RESPONSE.ERROR,
        ),
      );
    }

    // 生成函数
    const generate = () =>
      cryptoRandomString({
        length,
        ...(characters ? { characters } : { type }),
      });

    const result = Array.from({ length: count }, generate);

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
