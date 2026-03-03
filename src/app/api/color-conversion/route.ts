/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 11:16:56
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 11:22:59
 * @Description: 颜色转换
 */
import { NextRequest, NextResponse } from 'next/server'
import tinycolor from "tinycolor2";

import { RESPONSE } from '@/enums';
import { responseMessage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const c = searchParams.get('color') || ''; // 需要转换的颜色，支持hex、rgb、hsl、hsv格式
    const color = tinycolor(c);

    // 参数校验
    if (!color || !color.isValid()) {
      return NextResponse.json(responseMessage(null, "参数 color 不合法", RESPONSE.ERROR))
    }

    const result = {
      hex: color.toHexString(),
      rgb: color.toRgbString(),
      hsl: color.toHslString(),
      hsv: color.toHsvString(),
    };

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}