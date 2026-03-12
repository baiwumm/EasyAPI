/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:13:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 14:21:20
 * @Description: 今日诗词
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format');
    const response = await fetch("https://v1.jinrishici.com/all.json");

    // 执行失败
    if (!response.ok) {
      return NextResponse.json(responseMessage(null, `今日诗词 接口出错：HTTP ${response.status}`, RESPONSE.ERROR))
    }

    const responseBody = await response.json();

    // 返回 text 格式
    if (format === 'text') {
      return new NextResponse(responseBody.content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    return NextResponse.json(responseMessage(responseBody));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}