import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { getDiaryPoetry } from "@/lib/server/diary-poetry";
import { catchError, responseMessage } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:13:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:47:57
 * @Description: 今日诗词
 */

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format");

    // 模块级缓存：一天内复用同一首，避免每请求都打第三方
    const poetry = await getDiaryPoetry();

    // 返回 text 格式
    if (format === "text") {
      return new NextResponse(poetry.content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    return NextResponse.json(responseMessage(poetry));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
