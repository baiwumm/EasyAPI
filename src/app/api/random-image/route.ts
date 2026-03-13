/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 09:20:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 09:27:02
 * @Description: 随机图片
 */
import { fakerZH_CN as faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from 'next/server'

import { catchError, responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = new URL(request.url);

    const count = Math.min(Math.max(parseInt(searchParams.get("count") || "5"), 1), 20)
    const width = Math.min(Math.max(parseInt(searchParams.get("width") || "128"), 16), 1024);
    const height = Math.min(Math.max(parseInt(searchParams.get("height") || "128"), 16), 1024);

    const images = Array.from({ length: count }, () => faker.image.url({ width, height }));

    return NextResponse.json(responseMessage(images))
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}