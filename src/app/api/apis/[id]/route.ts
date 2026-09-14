import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import { parseApiBody } from "@/lib/server/write-guard";
import { catchError, responseMessage } from "@/lib/utils";

/**
 * @description: 删除接口
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

    const { data, error } = await supabase
      .from("ea_apis")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(
      responseMessage(null, (err as Error).message, RESPONSE.ERROR),
    );
  }
}

/**
 * @description: 修改接口
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
    const { payload, error: bodyError } = parseApiBody(
      await request.json(),
      "update",
    );

    if (bodyError || !payload) {
      return NextResponse.json(
        responseMessage(null, bodyError, RESPONSE.ERROR),
      );
    }

    // 更新接口
    const { data, error } = await supabase
      .from("ea_apis")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === "23505") {
        // 按约束名区分：path/operation_id 的唯一冲突不再误报"名称已存在"
        const constraint = (error as { constraint?: string }).constraint ?? "";

        return NextResponse.json(
          responseMessage(
            null,
            constraint.includes("name")
              ? "接口名称已存在！"
              : "保存失败：数据已存在（唯一性冲突）",
            RESPONSE.DUPLICATE,
          ),
        );
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
