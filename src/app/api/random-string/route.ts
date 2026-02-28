/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:11:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 17:17:21
 * @Description: 随机字符串
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    // 参数处理
    const type = searchParams.get('type') ?? "number"; // number, lower, upper, symbol, 也可以逗号组合
    const length = Math.min(
      Math.max(parseInt(searchParams.get('length') || '16'), 1),
      100
    ); // 默认16，最大100

    const count = Math.min(
      Math.max(parseInt(searchParams.get('count') || '1'), 1),
      50
    ); // 默认1，最大50

    const exclude =
      searchParams.get('exclude') || ''; // 需要排除的字符

    // 字符集
    const charsetMap: Record<string, string> = {
      number: "0123456789",
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      symbol: "!@#$%^&*()-_=+[]{}|;:,.<>/?",
    };

    // 解析 type
    const types = type.split(",").map((t) => t.trim());
    let charset = "";
    types.forEach((t) => {
      if (charsetMap[t]) charset += charsetMap[t];
    });
    if (!charset) charset = charsetMap["number"]; // 默认数字

    // 排除指定字符
    if (exclude) {
      const excludeSet = new Set(exclude.split(""));
      charset = [...charset].filter((ch) => !excludeSet.has(ch)).join("");
    }

    // 如果排除后没有可用字符，直接报错
    if (!charset) {
      return NextResponse.json(responseMessage(null, '字符集为空，请检查 type 和 exclude 参数', RESPONSE.ERROR))
    }

    // 生成函数
    const generateString = () => {
      let str = "";
      for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * charset.length);
        str += charset[idx];
      }
      return str;
    };

    // 批量生成
    const result = Array.from({ length: count }, generateString);

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}