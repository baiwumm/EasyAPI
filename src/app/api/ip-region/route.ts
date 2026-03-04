/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:49:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 09:24:31
 * @Description: IP 归属地查询
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums';
import { responseMessage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams
    const ip = searchParams.get('ip')

    // 获取客户端 IP
    const clientIP =
      ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.ip || // 在 Vercel 可用
      null

    // 参数校验
    if (!clientIP) {
      return NextResponse.json(responseMessage(null, "无法获取 IP 地址", RESPONSE.ERROR))
    }

    // 调用淘宝 IP 库接口
    const res = await fetch(
      `http://ip.taobao.com/outGetIpInfo?ip=${clientIP}&accessKey=alibaba-inc`,
      {
        method: 'GET',
        cache: 'no-store', // 避免缓存
      }
    )

    const json = await res.json();

    if (json.code !== 0 || !json.data) {
      return NextResponse.json(responseMessage(json))
    }

    const data = json.data;

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}