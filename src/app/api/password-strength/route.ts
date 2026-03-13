/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 17:15:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 14:56:02
 * @Description: 密码强度检测
 */
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnZhPackage from '@zxcvbn-ts/language-zh'
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { catchError, responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = request.nextUrl;

    const password = searchParams.get("password") || "";

    // 参数校验
    if (!password) {
      return NextResponse.json(responseMessage(null, "参数 password 必填", RESPONSE.ERROR))
    }

    if (password.length > 128) {
      return NextResponse.json(responseMessage(null, "参数 password 长度不能超过 128 个字符", RESPONSE.ERROR));
    }

    const options = {
      translations: zxcvbnZhPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnZhPackage.dictionary
      },
    }

    zxcvbnOptions.setOptions(options)

    const result = zxcvbn(password);

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}