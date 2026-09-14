import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import { parseCategoryBody } from "@/lib/server/write-guard";
import { catchError, responseMessage } from "@/lib/utils";

/**
 * @description: 删除分类
 * @param {Request} request
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 先解析动态参数（不依赖客户端）
    const { id } = await params;

    // 校验管理员（登录 + 邮箱白名单）
    const user = await requireAdmin();

    if (!user) {
      return NextResponse.json(
        responseMessage(null, "未登录或无权限", RESPONSE.ERROR),
        { status: 401 },
      );
    }

    const supabase = await getSupabaseServerClient();

    // 删除分类
    const { data, error } = await supabase
      .from("ea_categorys")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    // 返回成功响应
    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}

/**
 * @description: 修改分类
 * @param {Request} request
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 先解析动态参数（不依赖客户端）
    const { id } = await params;

    // 校验管理员（登录 + 邮箱白名单）
    const user = await requireAdmin();

    if (!user) {
      return NextResponse.json(
        responseMessage(null, "未登录或无权限", RESPONSE.ERROR),
        { status: 401 },
      );
    }

    const supabase = await getSupabaseServerClient();
    // 解析请求体（白名单过滤）
    const { payload, error: bodyError } = parseCategoryBody(
      await request.json(),
      "update",
    );

    if (bodyError || !payload) {
      return NextResponse.json(
        responseMessage(null, bodyError, RESPONSE.ERROR),
      );
    }

    // 更新分类
    const { data, error } = await supabase
      .from("ea_categorys")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === "23505") {
        return NextResponse.json(responseMessage(null, "分类名称已存在！", -1));
      }

      // 其他错误
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    // 返回更新后的菜单数据
    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
