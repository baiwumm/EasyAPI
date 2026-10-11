/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:49:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:56:54
 * @Description: IP 归属地查询
 */
import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getClientIp } from "@/lib/server/api-helpers";
import { catchError, responseMessage } from "@/lib/utils";

// IPv4 / IPv6 粗校验：ip 会拼进第三方接口路径，必须拦截路径注入字符
const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]{2,45}$/;

// 指定 IP 的归属地基本不变，给长缓存：CDN 多挡一天，上游就少一批请求。
// 这个路由是全站最贵的（每请求最多 2 次非受信出站 fetch），不缓存等于白烧额度（C12）
const EXPLICIT_IP_CACHE =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

// 不指定 IP 时返回的是调用方自己的出口 IP，结果因人而异，绝不能进公共缓存
const AUTO_IP_CACHE = "private, no-store";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const ip = searchParams.get("ip");

    const cacheControl = ip ? EXPLICIT_IP_CACHE : AUTO_IP_CACHE;

    // 获取客户端 IP
    let clientIP = ip || getClientIp(request);

    // 未显式传 IP 且本地是回环地址时，借助外部服务获取出口 IP
    if (!ip && (!clientIP || clientIP === "::1" || clientIP === "127.0.0.1")) {
      const res = await fetch("https://ipv4.icanhazip.com", {
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) {
        return cachedResponse(
          responseMessage(null, "获取出口 IP 失败", RESPONSE.ERROR),
          cacheControl,
        );
      }

      clientIP = (await res.text()).trim();
    }

    // 参数校验
    if (!clientIP || !IP_PATTERN.test(clientIP)) {
      return cachedResponse(
        responseMessage(null, "IP 地址格式不正确", RESPONSE.ERROR),
        cacheControl,
      );
    }

    // 调用 ip-api 免费版（该服务免费层仅支持 HTTP）
    const res = await fetch(`http://ip-api.com/json/${clientIP}?lang=zh-CN`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return cachedResponse(
        responseMessage(
          null,
          `IP 归属地查询失败：HTTP ${res.status}`,
          RESPONSE.ERROR,
        ),
        cacheControl,
      );
    }

    // 第三方可能返回非 JSON（限流页 HTML、空 body 等）。
    // 兜底走固定文案，不要把 Unexpected token 这类解析原文透给调用方（C12）
    const json = await res.json().catch(() => null);

    if (!json || typeof json !== "object") {
      return cachedResponse(
        responseMessage(null, "归属地数据解析失败", RESPONSE.ERROR),
        cacheControl,
      );
    }

    return cachedResponse(responseMessage(json), cacheControl);
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}

/** 带 Cache-Control 的 JSON 响应 */
function cachedResponse(body: unknown, cacheControl: string) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": cacheControl },
  });
}
