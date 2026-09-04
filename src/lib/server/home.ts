/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-08-10 10:00:00
 * @Description: 首页服务端数据
 */
import type { Category } from "@/typings";

import { cache } from "react";

import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * @description: 首页数据（全部分类 + 接口），服务端直接查询
 * 查询与排序逻辑与 /api/categorys 保持一致，供 RSC 页面复用
 * React.cache 保证同一请求内多处调用只查一次库
 */
export const fetchHomeData = cache(async (): Promise<Category[]> => {
  const supabase = await getSupabaseServerClient();

  // 查询 sql（只取页面实际用到的列，减小 RSC 序列化体积）
  const { data, error } = await supabase
    .from("ea_categorys")
    .select(
      "id,name,sort,created_at,apis:ea_apis(id,name,desc,path,method,call_count,pinned,is_featured,created_at,sort)",
    )
    .order("sort", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  // 执行失败
  if (error) {
    throw new Error(error.message);
  }

  // supabase 行类型未覆盖 Columns 全字段，按业务类型断言（只取页面用到的列）
  const list = (data ?? []) as Category[];

  list.forEach((category: Category) => {
    // 接口排序（原地排序，与 /api/categorys 保持一致）：置顶 → sort 降序 → 推荐 → 创建时间降序
    category?.apis?.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;

      if (b.sort !== a.sort) return b.sort - a.sort;

      if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  });

  return list;
});
