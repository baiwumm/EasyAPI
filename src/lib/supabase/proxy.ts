import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const path = request.nextUrl.pathname

  if (path.startsWith('/api')) {
    // 去掉 /api 前缀，并且去掉查询参数
    const reqPath = path.replace(/^\/api/, '').split('?')[0]
    // 先查 ea_apis 表，看有没有 path 匹配当前请求
    const { data } = await supabase
      .from('ea_apis')
      .select('id, path')
      .eq('path', reqPath)
      .limit(1)
      .single()

    if (data) {
      // 调用 RPC 函数随机增加 call_count 1~10
      const increment = Math.floor(Math.random() * 10) + 1
      await supabase.rpc('increment_call_count', {
        row_id: data.id,
        inc: increment,
      })
    }
    return supabaseResponse
  }

  const url = request.nextUrl.clone()
  const code = url.searchParams.get('code')

  // ✅ 只要有 code，立刻清理并跳首页
  if (code) {
    url.searchParams.delete('code')
    return NextResponse.rewrite(url)
  }

  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  // 已登录访问登录页码，跳转至管理页面
  if (user && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (!user && path.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return supabaseResponse
}
