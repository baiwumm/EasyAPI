/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 10:39:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-03 10:52:12
 * @Description: 随机颜色
 */
import { NextRequest, NextResponse } from 'next/server'
import tinycolor from "tinycolor2";

import { responseMessage } from '@/lib/utils';

type Format = "hex" | "rgb" | "hsl" | "hsv" | "all";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const fmt = (searchParams.get('format') ?? "all") as Format; // format (string): 返回格式，可选值: hex | rgb | hsl | hsv | all（默认）

    const count = Math.min(
      Math.max(parseInt(searchParams.get('count') || '1'), 1),
      50
    ); // count (number): 要生成颜色的数量，1-50，默认 1

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
    if (fmt === "all") {
      result = colors;
    } else {
      result = colors.map((color) => color[fmt]);
    }

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}