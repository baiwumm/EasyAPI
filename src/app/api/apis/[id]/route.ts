import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { responseMessage } from '@/lib/utils'

/**
 * @description: 修改接口
 * @param {Request} request
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    // 获取动态参数
    const { id } = await params;
    // 解析请求体
    const body = await request.json(); // 如果是 JSON 数据

    // 更新分类
    const { data, error } = await supabase
      .from('ea_apis')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === '23505') {
        return NextResponse.json(responseMessage(null, '接口名称已存在！', -1));
      }

      // 其他错误
      return NextResponse.json(responseMessage(null, error.message, RESPONSE.ERROR));
    }

    // 返回更新后的菜单数据
    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}

/**
 * @description: 删除接口
 * @param {Request} request
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('ea_apis')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR)
      );
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(
      responseMessage(null, (err as Error).message, RESPONSE.ERROR)
    );
  }
}
