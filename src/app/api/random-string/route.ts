/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 17:11:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 09:49:35
 * @Description: 随机字符串
 */
import cryptoRandomString, { type Options } from 'crypto-random-string'
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams

    const length = Math.min(
      Math.max(parseInt(searchParams.get('length') || '16'), 1),
      100
    )

    const count = Math.min(
      Math.max(parseInt(searchParams.get('count') || '1'), 1),
      50
    )

    const type = (searchParams.get('type') || 'alphanumeric') as Options['type']
    const characters = searchParams.get('characters')

    // 官方支持的 type 列表
    const validTypes: Options['type'][] = [
      'hex',
      'base64',
      'url-safe',
      'numeric',
      'distinguishable',
      'ascii-printable',
      'alphanumeric'
    ]

    // 参数校验
    if (!characters && !validTypes.includes(type)) {
      return NextResponse.json(
        responseMessage(
          null,
          `type 参数无效，可选值：${validTypes.join(', ')}`,
          RESPONSE.ERROR
        )
      )
    }

    // 生成函数
    const generate = () =>
      cryptoRandomString({
        length,
        ...(characters
          ? { characters }
          : { type })
      })

    const result = Array.from({ length: count }, generate)

    return NextResponse.json(responseMessage(result))
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}