/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 17:15:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-11-24 16:30:00
 * @Description: 密码强度检测
 */
import type { NextRequest } from "next/server";

import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnZhPackage from "@zxcvbn-ts/language-zh";
import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getClientIp } from "@/lib/server/api-helpers";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { catchError, responseMessage } from "@/lib/utils";

// 对外响应结构：与 @zxcvbn-ts v3 时代保持一致，避免破坏公开 API 契约（见 public/openapi.yaml）
export type PasswordStrengthResult = {
  score: number;
  guesses: number;
  guessesLog10: number;
  calcTime: number;
  crackTimesSeconds: {
    onlineThrottling100PerHour: number;
    onlineNoThrottling10PerSecond: number;
    offlineSlowHashing1e4PerSecond: number;
    offlineFastHashing1e10PerSecond: number;
  };
  crackTimesDisplay: {
    onlineThrottling100PerHour: string;
    onlineNoThrottling10PerSecond: string;
    offlineSlowHashing1e4PerSecond: string;
    offlineFastHashing1e10PerSecond: string;
  };
  feedback: {
    warning: string | null;
    suggestions: string[];
  };
};

// zxcvbn 实例与请求无关，模块加载时初始化一次，避免每个请求重复构建词典索引。
// v4 起改用 ZxcvbnFactory 注入翻译 / 邻接图 / 词典（取代 v3 的 zxcvbnOptions.setOptions）。
const zxcvbn = new ZxcvbnFactory({
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

    const { score, guesses, guessesLog10, calcTime, crackTimes, feedback } =
      zxcvbn.check(password);

    // v4 把破解时间收敛进 crackTimes（每项 { base, seconds, display }），
    // 这里还原成 v3 的 crackTimesSeconds / crackTimesDisplay 两个平铺对象，保持响应契约不变。
    // 只回文档登记的字段：zxcvbn 的原始返回里带 password 字段本身，不透出去，
    // 避免前端 CopyText 把密码原文抄进剪贴板（C13）
    const result: PasswordStrengthResult = {
      score,
      guesses,
      guessesLog10,
      calcTime,
      crackTimesSeconds: {
        onlineThrottling100PerHour: crackTimes.onlineThrottlingXPerHour.seconds,
        onlineNoThrottling10PerSecond:
          crackTimes.onlineNoThrottlingXPerSecond.seconds,
        offlineSlowHashing1e4PerSecond:
          crackTimes.offlineSlowHashingXPerSecond.seconds,
        offlineFastHashing1e10PerSecond:
          crackTimes.offlineFastHashingXPerSecond.seconds,
      },
      crackTimesDisplay: {
        onlineThrottling100PerHour: crackTimes.onlineThrottlingXPerHour.display,
        onlineNoThrottling10PerSecond:
          crackTimes.onlineNoThrottlingXPerSecond.display,
        offlineSlowHashing1e4PerSecond:
          crackTimes.offlineSlowHashingXPerSecond.display,
        offlineFastHashing1e10PerSecond:
          crackTimes.offlineFastHashingXPerSecond.display,
      },
      feedback: {
        warning: feedback.warning,
        suggestions: feedback.suggestions,
      },
    };

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
