import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { getSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import { catchError, responseMessage, sanitizeLikeKeyword } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:08:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:40:59
 * @Description: 接口列表模块
 */

/**
 * @description: 查询接口列表
 * @param {Request} request
 */
export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const pageIndex = Number(searchParams.get("pageIndex") || "0");
    const pageSize = Number(searchParams.get("pageSize") || "10");
    const name = searchParams.get("name");
    const category_id = searchParams.get("category_id");

    // 判断参数（同步校验前置，通过后才创建客户端）
    // pageSize 上限 1000：接口为公开路由，无上限可一次拉全表刷穿 Supabase 配额
    if (
      Number.isNaN(pageIndex) ||
      Number.isNaN(pageSize) ||
      pageIndex < 0 ||
      pageSize <= 0 ||
      pageSize > 1000
    ) {
      return NextResponse.json(
        responseMessage(null, "参数错误", RESPONSE.ERROR),
      );
    }

    // 计算分页
    const start = pageIndex * pageSize;
    const end = start + pageSize - 1;

    const supabase = await getSupabaseServerClient();

    // 查询 sql
    let sqlQuery = supabase
      .from("ea_apis")
      .select("*,category:ea_categorys(*)", { count: "exact" })
      .range(start, end)
      .order("pinned", {
        ascending: false,
      })
      .order("sort", {
        ascending: false,
      })
      .order("is_featured", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

    // 判断查询参数
    if (name) {
      sqlQuery = sqlQuery.like("name", `%${sanitizeLikeKeyword(name)}%`);
    }
    if (category_id) {
      sqlQuery = sqlQuery.eq("category_id", category_id);
    }

    // 请求列表
    const { data, error, count } = await sqlQuery;

    // 执行失败
    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    return NextResponse.json(
      responseMessage({
        list: data,
        total: count,
        page: pageIndex + 1,
        pageSize,
      }),
    );
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}

/**
 * @description: 新增接口
 * @param {Request} request
 */
export async function POST(request: NextRequest) {
  try {
    // 校验管理员（登录 + 邮箱白名单）
    const user = await requireAdmin();

    if (!user) {
      return NextResponse.json(
        responseMessage(null, "未登录或无权限", RESPONSE.ERROR),
        { status: 401 },
      );
    }

    const supabase = await getSupabaseServerClient();
    // 解析请求体
    const body = await request.json(); // 如果是 JSON 数据

    // 插入数据
    const { data, error } = await supabase
      .from("ea_apis")
      .insert(body)
      .select()
      .single();

    // 如果插入失败
    if (error) {
      // 判断是否违反唯一性约束（PostgreSQL 错误代码 23505）
      if (error.code === "23505") {
        return NextResponse.json(responseMessage(null, "接口名称已存在！", -1));
      }

      // 其他错误
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
