import type { SupabaseClient } from "@supabase/supabase-js";

import { createBrowserClient } from "@supabase/ssr";

// 浏览器端模块级单例：避免每次 render 都创建新实例，
// 导致依赖 [supabase] 的 effect 每次 render 重建订阅、重复发请求。
// SSR 环境不缓存（每次新建），避免 Node 进程内跨请求/跨用户共享会话状态
let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return client;
}
