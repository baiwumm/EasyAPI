import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/** 跳回登录页并带上失败码，由登录页映射成提示文案 */
function loginRedirect(origin: string, errorCode: string) {
  const url = new URL("/login", origin);

  url.searchParams.set("error", errorCode);

  return NextResponse.redirect(url);
}

/**
 * @description: OAuth 回调：服务端用 code 换 session，地址栏只在路由处理的一瞬
 * 露出 code 随即 302 到干净地址（原先靠浏览器端 detectSessionInUrl 交换，
 * 首页带着 ?code= 可见数秒）。成功回首页，失败带失败码回登录页。
 * 注意：本路由地址需在 Supabase Dashboard → Authentication → URL
 * Configuration → Redirect URLs 白名单内，否则 Supabase 回退 Site URL、
 * 退化为旧的浏览器端交换行为
 * @param {NextRequest} request
 */
export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const providerError = searchParams.get("error");

  // Supabase 拒绝登录（如注册已关闭）或用户取消授权时，回调只带错误参数、没有 code
  if (providerError) {
    return loginRedirect(
      origin,
      searchParams.get("error_code") ?? providerError,
    );
  }

  const code = searchParams.get("code");

  if (!code) {
    return loginRedirect(origin, "server_error");
  }

  // 会话 cookie 直接写到这个重定向响应上，交换失败时整个响应丢弃
  const response = NextResponse.redirect(new URL("/", origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return loginRedirect(origin, "server_error");
  }

  return response;
}
