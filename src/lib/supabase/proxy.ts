import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const path = request.nextUrl.pathname;

  if (path.startsWith("/api")) {
    // 去掉 /api 前缀，并且去掉查询参数
    const reqPath = path.replace(/^\/api/, "").split("?")[0];
    // 先查 ea_apis 表，看有没有 path 匹配当前请求
    const { data } = await supabase
      .from("ea_apis")
      .select("id, path")
      .eq("path", reqPath)
      .limit(1)
      .single();

    if (data) {
      // 调用 RPC 函数随机增加 call_count 1~10
      const increment = Math.floor(Math.random() * 10) + 1;

      // 计数失败不能静默（如 RLS 拦截 SECURITY INVOKER 的 RPC），至少留痕
      const { error: rpcError } = await supabase.rpc("increment_call_count", {
        row_id: data.id,
        inc: increment,
      });

      if (rpcError) {
        // 服务端运维日志（中间件无上报通道），定向豁免 no-console
        // eslint-disable-next-line no-console
        console.error("increment_call_count failed:", rpcError.message);
      }
    }

    return supabaseResponse;
  }

  const url = request.nextUrl.clone();
  const code = url.searchParams.get("code");

  // ✅ 只要有 code，立刻清理并跳首页
  if (code) {
    url.searchParams.delete("code");

    return NextResponse.rewrite(url);
  }

  const { data } = await supabase.auth.getClaims();

  const claims = data?.claims;

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
