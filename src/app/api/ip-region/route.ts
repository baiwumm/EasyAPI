/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:49:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:56:54
 * @Description: IP 归属地查询
 */
import { NextRequest, NextResponse } from 'next/server'

import { catchError, responseMessage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams
    const ip = searchParams.get('ip')

    // 获取客户端 IP
    const forwarded = request.headers.get("x-forwarded-for");

    let clientIP =
      ip ||
      forwarded?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      null;

    // 参数校验
    if (!clientIP || clientIP === "::1" || clientIP === "127.0.0.1") {
      const res = await fetch("https://ipv4.icanhazip.com");
      const data = await res.text();
      clientIP = data;
    }

    // 调用淘宝 IP 库接口
    const res = await fetch(`http://ip-api.com/json/${clientIP}?lang=zh-CN`)

    const json = await res.json();

    return NextResponse.json(responseMessage(json));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}