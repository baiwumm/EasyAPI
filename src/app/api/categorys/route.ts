import type { Category } from "@/typings";
import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { revalidateHome } from "@/lib/server/home";
import { getSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import { parseCategoryBody } from "@/lib/server/write-guard";
import {
  catchError,
  parseBoundedInt,
  responseMessage,
  sanitizeLikeKeyword,
} from "@/lib/utils";

/**
 * @description: 查询分类列表
 * @param {Request} request
 */

// pageIndex 上限：配合 pageSize 上限 1000，最大约一千万行的偏移，
// 再往上就是拿接口扫库而非查数据了
const MAX_PAGE_INDEX = 10000;

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");

    // 分页参数（同步校验前置，通过后才创建客户端）
    // pageSize 上限 1000：接口为公开路由，无上限可一次拉全表刷穿 Supabase 配额
    // pageIndex 同样要有上限：没有的话 ?pageIndex=1e9 会让 PostgREST 的 range()
    // 直接报错，拿到的是一条看不懂的库错误而不是友好提示（D19）
    const pageIndex = parseBoundedInt(
      searchParams.get("pageIndex"),
      0,
      0,
      MAX_PAGE_INDEX,
    );
    const pageSize = parseBoundedInt(searchParams.get("pageSize"), 10, 1, 1000);

    // 计算分页
    const start = pageIndex * pageSize;
    const end = start + pageSize - 1;

    const supabase = await getSupabaseServerClient();

    // 查询 sql
    let sqlQuery = supabase
      .from("ea_categorys")
      .select("*,apis:ea_apis(*)", { count: "exact" })
      .range(start, end)
      .order("sort", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

    // 判断查询参数
    if (name) {
      sqlQuery = sqlQuery.like("name", `%${sanitizeLikeKeyword(name)}%`);
    }

    // 请求列表
    const { data, error, count } = await sqlQuery;

    // 执行失败
    if (error) {
      return NextResponse.json(
        responseMessage(null, error.message, RESPONSE.ERROR),
      );
    }

    if (data) {
      data.forEach((category: Category) => {
        category?.apis.sort((a, b) => {
          // 2. 再按 pinned 降序 (true 排在前面)
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;

          // 1. 先按 sort 降序 (b - a)
          if (b.sort !== a.sort) return b.sort - a.sort;

          // 3. 然后按 is_featured 降序 (true 排在前面)
          if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;

          // 4. 最后按 created_at 降序 (新日期在前)
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
      });
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
 * @description: 新增分类
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
    // 解析请求体（白名单过滤 + 必填校验）
    const { payload, error: bodyError } = parseCategoryBody(
      await request.json(),
      "create",
    );

    if (bodyError || !payload) {
      return NextResponse.json(
        responseMessage(null, bodyError, RESPONSE.ERROR),
      );
    }

    // 插入数据
    const { data, error } = await supabase
      .from("ea_categorys")
      .insert(payload)
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

    return NextResponse.json(responseMessage(data));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
