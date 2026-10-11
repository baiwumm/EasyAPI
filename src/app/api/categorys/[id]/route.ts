import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { revalidateHome } from "@/lib/server/home";
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

    // 服务端引用检查：分类下仍有接口时拒绝删除（不能只依赖前端守卫，
    // 否则数据陈旧时会产生孤儿接口）
    const { count, error: countError } = await supabase
      .from("ea_apis")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      return NextResponse.json(
        responseMessage(null, countError.message, RESPONSE.ERROR),
      );
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        responseMessage(null, "该分类下存在关联接口，无法删除", RESPONSE.ERROR),
      );
    }

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

    // 写成功：让首页立刻去掉已删除的分类（ISR 最迟 5 分钟才生效，见 F2）
    revalidateHome();

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
        return NextResponse.json(
          responseMessage(null, "分类名称已存在！", RESPONSE.DUPLICATE),
        );
      }

      // 其他错误
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    // 写成功：让首页立刻拿到新数据（ISR 最迟 5 分钟才生效，见 F2）
    revalidateHome();

    // 返回更新后的菜单数据
    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
