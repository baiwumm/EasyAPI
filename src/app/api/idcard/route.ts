/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 15:28:23
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-10 10:00:35
 * @Description: 身份证信息查询
 */
import idCard from 'idcard';
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums';
import { responseMessage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const id = searchParams.get('id');

    // 参数校验
    if (!id || !idCard.verify(id)) {
      return NextResponse.json(responseMessage(null, "身份证不合法！", RESPONSE.ERROR))
    }

    const result = idCard.info(id);

    if (!result) {
      return NextResponse.json(responseMessage(null, "无法解析身份证信息！", RESPONSE.ERROR))
    }

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}