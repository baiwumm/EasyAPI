/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-29 22:09:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-29 22:50:39
 * @Description: 车牌归属地查询
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
      .from("ea_license_plate")
      .select('province,city,code,prefix')
      .or(`province.ilike.%${keyword}%,city.ilike.%${keyword}%,prefix.ilike.%${keyword}%`)
      .limit(20)

    if (error) {
      return formatFail("未找到相关车牌归属地信息");
    }

    return formatSuccess(data)
  } catch (error) {
    return formatFail((error as Error)?.message || "车牌归属地查询失败");
  }
})