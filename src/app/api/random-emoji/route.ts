/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 15:58:04
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 16:01:28
 * @Description: 随机 emoji
 */
import { NextRequest, NextResponse } from 'next/server'
import * as emoji from 'node-emoji';

import { responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;

    const count = Math.min(
      Math.max(parseInt(searchParams.get('count') || '1'), 1),
      50
    )

    const result = Array.from({ length: count }, () => emoji.random())

    return NextResponse.json(responseMessage(result))
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}