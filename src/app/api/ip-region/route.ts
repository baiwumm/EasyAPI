import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { catchError, responseMessage } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-03 16:49:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:56:54
 * @Description: IP 归属地查询
 */

// IPv4 / IPv6 粗校验：ip 会拼进第三方接口路径，必须拦截路径注入字符
const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]{2,45}$/;

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const ip = searchParams.get("ip");

    // 获取客户端 IP
    const forwarded = request.headers.get("x-forwarded-for");

    let clientIP =
      ip ||
      forwarded?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "";

    // 未显式传 IP 且本地是回环地址时，借助外部服务获取出口 IP
    if (!ip && (!clientIP || clientIP === "::1" || clientIP === "127.0.0.1")) {
      const res = await fetch("https://ipv4.icanhazip.com", {
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) {
        return NextResponse.json(
          responseMessage(null, "获取出口 IP 失败", RESPONSE.ERROR),
        );
      }

      clientIP = (await res.text()).trim();
    }

    // 参数校验
    if (!clientIP || !IP_PATTERN.test(clientIP)) {
      return NextResponse.json(
        responseMessage(null, "IP 地址格式不正确", RESPONSE.ERROR),
      );
    }

    // 调用 ip-api 免费版（该服务免费层仅支持 HTTP）
    const res = await fetch(`http://ip-api.com/json/${clientIP}?lang=zh-CN`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json(
        responseMessage(
          null,
          `IP 归属地查询失败：HTTP ${res.status}`,
          RESPONSE.ERROR,
        ),
      );
    }

    const json = await res.json();

    return NextResponse.json(responseMessage(json));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
