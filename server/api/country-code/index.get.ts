/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-09 16:36:41
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-09 16:47:13
 * @Description: 国际区号查询
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const keyword = query.keyword as string

    if (!keyword) {
      return formatFail("请输入查询关键字")
    }

    const supabase = await serverSupabaseClient(event)

    // 按邮编查地区，返回单个对象
    const { data, error } = await supabase
      .from("ea_country_code")
      .select('englishName,name,countryCode,phoneCode')
      .or(`name.ilike.%${keyword}%,phoneCode.ilike.%${keyword}%`)
      .limit(20)

    if (error) {
      return formatFail("未找到相关国际区号信息");
    }

    return formatSuccess(data)
  } catch (error) {
    return formatFail((error as Error)?.message || "国际区号查询失败");
  }
})