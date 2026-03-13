/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 10:39:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 14:27:01
 * @Description: 随机颜色
 */
import { NextRequest, NextResponse } from 'next/server'
import tinycolor from "tinycolor2";

import { RANDOM_COLOR_FORMATS, RESPONSE } from '@/enums';
import { catchError, responseMessage } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const fmt = (searchParams.get('format') ?? RANDOM_COLOR_FORMATS.ALL) as typeof RANDOM_COLOR_FORMATS.valueType; // format (string): 返回格式，可选值: hex | rgb | hsl | hsv | all（默认）

    const count = Math.min(
      Math.max(parseInt(searchParams.get('count') || '1'), 1),
      50
    ); // count (number): 要生成颜色的数量，1-50，默认 1

    // 参数校验
    const allowedFormats = RANDOM_COLOR_FORMATS.values;
    if (!allowedFormats.includes(fmt)) {
      return NextResponse.json(responseMessage(null, `参数 format 必须是 ${allowedFormats.join("、")}`, RESPONSE.ERROR));
    }

    // generate
    const colors = [];
    for (let i = 0; i < Math.round(count); i++) {
      const color = tinycolor.random();
      colors.push({
        hex: color.toHexString(),
        rgb: color.toRgbString(),
        hsl: color.toHslString(),
        hsv: color.toHsvString(),
      });
    }

    // map result according to format
    let result: unknown;
    if (fmt === RANDOM_COLOR_FORMATS.ALL) {
      result = colors;
    } else {
      result = colors.map((color) => color[fmt]);
    }

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}