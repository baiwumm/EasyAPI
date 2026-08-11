import { NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient, requireUser } from '@/lib/supabase/server'
import { catchError, responseMessage } from '@/lib/utils'

import type { NextRequest } from 'next/server'

/**
 * @description: 删除分类
 * @param {Request} request
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 先解析动态参数（不依赖客户端）
    const { id } = await params

    // 校验登录态
    const user = await requireUser()
    if (!user) {
      return NextResponse.json(responseMessage(null, '未登录', RESPONSE.ERROR), { status: 401 })
    }

    const supabase = await getSupabaseServerClient()

    // 删除分类
    const { data, error } = await supabase
      .from('ea_categorys')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR))
    }

    // 返回成功响应
    return NextResponse.json(responseMessage(data))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}

/**
 * @description: 修改分类
 * @param {Request} request
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 先解析动态参数（不依赖客户端）
    const { id } = await params

    // 校验登录态
    const user = await requireUser()
    if (!user) {
      return NextResponse.json(responseMessage(null, '未登录', RESPONSE.ERROR), { status: 401 })
    }

    const supabase = await getSupabaseServerClient()
    // 解析请求体
    const body = await request.json() // 如果是 JSON 数据

    // 更新分类
    const { data, error } = await supabase
      .from('ea_categorys')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === '23505') {
        return NextResponse.json(responseMessage(null, '分类名称已存在！', -1))
      }

      // 其他错误
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR))
    }

    // 返回更新后的菜单数据
    return NextResponse.json(responseMessage(data))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
