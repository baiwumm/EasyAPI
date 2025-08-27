/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-27 13:45:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-27 21:17:43
 * @Description: 邮政编码查询
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = query.type ? Number(query.type) : 1  // 默认 1
    const keyword = query.keyword as string

    if (!keyword) {
      return formatFail("请输入查询关键字")
    }

    const supabase = await serverSupabaseClient(event)

    let data;
    const selectFields = 'province,city,area,areaCode,postCode';

    if (type === 1) {
      // 按邮编查地区，返回单个对象
      const { data: res, error } = await supabase
        .from("ea_postal_code")
        .select(selectFields)
        .eq("postCode", keyword)
        .limit(1)
        .single()

      if (error) {
        return formatFail("未找到相关邮政编码信息");
      }
      data = res

    } else if (type === 2) {
      // 按地区查邮编，模糊匹配多个
      const { data: res, error } = await supabase
        .from("ea_postal_code")
        .select(selectFields)
        .or(`province.ilike.%${keyword}%,city.ilike.%${keyword}%,area.ilike.%${keyword}%`)
        .limit(20)

      if (!res?.length) {
        return formatFail("未找到相关邮政编码信息");
      }
      data = res
    } else {
      return formatFail("type 参数错误，只能是 1 或 2")
    }

    return formatSuccess(data || null)
  } catch (error) {
    return formatFail((error as Error)?.message || "邮政编码查询失败");
  }
})