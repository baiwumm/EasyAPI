/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-23 20:36:33
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-24 19:08:52
 * @Description: 
 */
import { serverSupabaseClient } from '#supabase/server'
import { RESPONSE_STATUS_CODE } from '~/lib/enum'
import type { Response, PageResponse, CategoryList, CategoryParams } from '~/lib/type'

export default defineEventHandler(async (event): Promise<Response<PageResponse<CategoryList>>> => {
  const client = await serverSupabaseClient(event)

  // 查询 sql
  const { data, error, count } = await client
    .from('ea_categorys')
    .select('name,desc,apis:ea_apis(name,desc,path,operation_id,method)', { count: 'exact' })
    .range(0, 9999)
    .order('sort', {
      ascending: false
    })
    .order('created_at', {
      ascending: false
    })

  // 判断请求结果
  if (error) {
    throw createError({
      statusCode: RESPONSE_STATUS_CODE.FAIL,
      statusMessage: error.message
    })
  }

  if (data) {
    data.forEach((category: CategoryList) => {
      category?.apis.sort((a, b) => {
        // 2. 再按 pinned 降序 (true 排在前面)
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1

        // 1. 先按 sort 降序 (b - a)
        if (b.sort !== a.sort) return b.sort - a.sort

        // 3. 然后按 is_featured 降序 (true 排在前面)
        if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1

        // 4. 最后按 created_at 降序 (新日期在前)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    })
  }

  return {
    message: "一个精美、现代化的 API 聚合平台！ 🚀",
    categories: data,
  };
});
