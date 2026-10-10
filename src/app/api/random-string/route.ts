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
import { catchError, parseBoundedInt, responseMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = request.nextUrl;

    // parseBoundedInt：非数字/NaN 时回退默认值，避免 Math.max(NaN, 1) 得到 NaN
    // 后把库错误原文或空数组当成成功结果返回
    const length = parseBoundedInt(searchParams.get("length"), 16, 1, 100);
    const count = parseBoundedInt(searchParams.get("count"), 1, 1, 50);

    const type = (searchParams.get("type") ||
      RANDOM_STRING_TYPES.ALPHANUMERIC) as Options["type"];
    const characters = searchParams.get("characters");

    // 自定义字符集无上限时会成为绕过 type 白名单的任意长 alphabet，需收敛
    const MAX_CHARACTERS_LENGTH = 256;

    // 官方支持的 type 列表
    const validTypes: Options["type"][] = RANDOM_STRING_TYPES.values;

    // 参数校验
    if (characters && characters.length > MAX_CHARACTERS_LENGTH) {
      return NextResponse.json(
        responseMessage(
          null,
          `参数 characters 长度不能超过 ${MAX_CHARACTERS_LENGTH} 个字符`,
          RESPONSE.ERROR,
        ),
      );
    }

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
