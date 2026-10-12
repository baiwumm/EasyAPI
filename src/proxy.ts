import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import {
  createMiddlewareClient,
  updateSession,
} from "@/lib/supabase/proxy";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 16:24:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 14:42:15
 * @Description: 代理层：/api 计数与会话守卫在此分叉
 */

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // /api/*：只读 GET 做调用计数，不进入会话流程。
  // 原先这段和守卫混在 lib 的 updateSession 里且提前 return（C6），
  // 现在守卫上移到本文件，职责按「会话机制 / 路由策略」拆开
  if (path.startsWith("/api")) {
    // 仅统计对外只读调用：管理端 CRUD 的 POST/PUT/DELETE 不计数
    if (request.method === "GET") {
      const { supabase } = createMiddlewareClient(request);

      // 去掉 /api 前缀，并且去掉查询参数
      const reqPath = path.replace(/^\/api/, "").split("?")[0];

      // F1/C5：不再先查 ea_apis 确认存在、再按 id 传随机增量（每个 GET 两轮
      // DB 往返且计数失真），改为固定 +1、按 path 单轮 RPC；未收录 path 在
      // 函数里天然 no-op（SQL 见 supabase/increment-call-count-by-path.sql）
      // 计数不阻塞响应（Node 运行时下返回后仍会执行）；
      // 失败不能静默（如 RLS 拦截 SECURITY INVOKER 的 RPC），至少留痕
      void supabase
        .rpc("increment_call_count_by_path", { p_path: reqPath })
        .then(({ error: rpcError }) => {
          if (rpcError) {
            // 服务端运维日志（中间件无上报通道），定向豁免 no-console
            // eslint-disable-next-line no-console
            console.error(
              "increment_call_count_by_path failed:",
              rpcError.message,
            );
          }
        });
    }

    return NextResponse.next();
  }

  const { supabaseResponse, claims } = await updateSession(request);

  // 管理员白名单（与 lib/supabase/server.ts 的 requireAdmin 保持一致）
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const email =
    typeof claims?.email === "string" ? claims.email.toLowerCase() : "";
  const isAdmin = !!(email && adminEmails.includes(email));

  // 已登录访问登录页：管理员跳转管理页面，其他用户回首页
  if (claims && path.startsWith("/login")) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/", request.url),
    );
  }

  // 未登录或非白名单邮箱访问管理页面，一律跳转登录页
  if ((!claims || !isAdmin) && path.startsWith("/admin")) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// 配置匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - _next (Next.js 内部文件)
     * - 静态资源 (如 .css, .png)
     * - API 路由 (可选，但通常不需要保护)
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js|json|xml|txt|md|png|jpg|jpeg|gif|webp|avif|ico|bmp|svg|tiff|tif|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf|otf|webmanifest)$).*)",
  ],
};
