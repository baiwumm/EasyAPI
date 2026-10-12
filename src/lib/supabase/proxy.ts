import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/** 会话声明中本项目用到的字段（宽松结构，字段存在性在调用方判断） */
export type SessionClaims = { email?: string } & Record<string, unknown>;

/**
 * 创建绑定请求 cookie 的中间件客户端。
 * token 刷新时 setAll 会把新 cookie 写进一个新的 NextResponse，
 * 因此响应必须经 getResponse() 在 auth 调用之后取，不能提前缓存引用
 */
export function createMiddlewareClient(request: NextRequest) {
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

  return {
    supabase,
    getResponse: () => supabaseResponse,
  };
}

/**
 * 页面导航的会话刷新：getClaims 时过期 token 经 setAll 续期并写入响应 cookie。
 * 只做会话机制（刷新 + 读 claims），不做路由策略——守卫在 src/proxy.ts。
 *
 * 注意：URL 带 ?code= 时这里不做任何拦截。OAuth 的 code 交换由浏览器端
 * @supabase/ssr 完成（detectSessionInUrl 默认开启）；服务端用 rewrite 清参数
 * 既不改浏览器地址栏，还会丢弃本响应上刚刷新的 cookie（C7，已删）
 */
export async function updateSession(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);
  const { data } = await supabase.auth.getClaims();

  return {
    supabaseResponse: getResponse(),
    claims: (data?.claims ?? null) as SessionClaims | null,
  };
}
