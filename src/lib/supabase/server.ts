import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * 每个请求内共享同一个 Supabase 服务端客户端，避免重复创建
 */
export const getSupabaseServerClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
});

/**
 * @description: 校验管理员：登录 + 邮箱白名单（ADMIN_EMAILS，逗号分隔），
 * 不满足任一条件返回 null（后台写操作接口鉴权用）
 */
export async function requireAdmin() {
  const user = await requireUser();

  if (!user?.email) {
    return null;
  }
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(user.email.toLowerCase())) {
    return null;
  }

  return user;
}

/**
 * @description: 校验登录态，未登录返回 null（写操作接口鉴权用）
 */
export async function requireUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
