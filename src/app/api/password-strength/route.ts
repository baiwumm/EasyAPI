/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 17:15:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 14:56:02
 * @Description: 密码强度检测
 */
import type { NextRequest } from "next/server";

import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnZhPackage from "@zxcvbn-ts/language-zh";
import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getClientIp } from "@/lib/server/api-helpers";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { catchError, responseMessage } from "@/lib/utils";

// zxcvbn 全局配置与请求无关，模块加载时初始化一次，避免每个请求重复 setOptions
zxcvbnOptions.setOptions({
  translations: zxcvbnZhPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnZhPackage.dictionary,
  },
});

// 单次检测约 35ms CPU，无限流时这个接口就是现成的算力放大器（C13）
const limiter = createRateLimiter({ limit: 20, windowMs: 60 * 1000 });

const MAX_PASSWORD_LENGTH = 128;

export async function POST(request: NextRequest) {
  try {
    // 密码不再走 query string：会原样落进 Vercel/CDN 访问日志（C13），
    // 改为从 JSON body 读取；解析失败按必填处理，不把解析原文透出去
    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : "";

    // 参数校验
    if (!password) {
      return NextResponse.json(
        responseMessage(null, "参数 password 必填", RESPONSE.ERROR),
      );
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        responseMessage(
          null,
          `参数 password 长度不能超过 ${MAX_PASSWORD_LENGTH} 个字符`,
          RESPONSE.ERROR,
        ),
      );
    }

    // 限流：放在 CPU 密集计算之前，超限请求直接返回
    if (!limiter.check(getClientIp(request))) {
      return NextResponse.json(
        responseMessage(null, "请求过于频繁，请稍后重试", RESPONSE.ERROR),
      );
    }

    const {
      score,
      guesses,
      guessesLog10,
      calcTime,
      crackTimesSeconds,
      crackTimesDisplay,
      feedback,
    } = zxcvbn(password);

    // 只回文档登记的字段：zxcvbn 的原始返回里带 password 字段本身，
    // 不透出去，避免前端 CopyText 把密码原文抄进剪贴板（C13）
    return NextResponse.json(
      responseMessage({
        score,
        guesses,
        guessesLog10,
        calcTime,
        crackTimesSeconds,
        crackTimesDisplay,
        feedback,
      }),
    );
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
