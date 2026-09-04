/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-11 15:09:49
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:53:40
 * @Description: 随机身份证号
 */
import type { NextRequest } from "next/server";

import idCard from "idcard";
import { NextResponse } from "next/server";

import { catchError, responseMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;

    // 生成的数量
    const count = Math.min(
      Math.max(parseInt(searchParams.get("count") || "1"), 1),
      50,
    );

    const result: string[] = [];

    for (let i = 0; i < Math.round(count); i++) {
      const value = idCard.generateIdcard({});

      result.push(value);
    }

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
