/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Description: GitHub 头像代理
 *
 * avatars.githubusercontent.com 在部分网络环境不可达（ERR_CONNECTION_CLOSED），
 * 用户头像加载失败只能展示默认人像。由服务端转发（Vercel 出网可达 GitHub），
 * 浏览器侧统一经本路由加载，并带长缓存减轻上游压力。
 *
 * 仅放行 GitHub 头像域名（防被当任意图片中转，SSRF）；上游失败返回错误
 * envelope，<img> 加载失败时 HeroUI Avatar 自动落到 Fallback 兜底。
 * 内部资源路由，不进 openapi 目录（同 /auth/* 口径）。
 */
import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { catchError, responseMessage } from "@/lib/utils";

/** 仅允许代理 GitHub 头像域名 */
const ALLOWED_PREFIX = "https://avatars.githubusercontent.com/";

export async function GET(request: NextRequest) {
  try {
    const target = request.nextUrl.searchParams.get("url");

    if (!target || !target.startsWith(ALLOWED_PREFIX)) {
      return NextResponse.json(
        responseMessage(null, "仅支持代理 GitHub 头像地址", RESPONSE.ERROR),
      );
    }

    const upstream = await fetch(target, {
      // GitHub 头像响应快且小，超时兜底避免占住函数实例
      signal: AbortSignal.timeout(5000),
    });
    const contentType = upstream.headers.get("content-type") ?? "";

    if (!upstream.ok || !contentType.startsWith("image/")) {
      return NextResponse.json(
        responseMessage(null, "头像获取失败", RESPONSE.ERROR),
      );
    }

    return new NextResponse(await upstream.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        // 头像内容更新由 GitHub 的 ?v= 查询参数控制，缓存一天安全
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
