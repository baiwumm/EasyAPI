/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-26 09:21:56
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-26 09:33:22
 * @Description: 每日笑话
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  const format = query.format || 'standard' // 默认返回标准格式
  try {
    const { data, error } = await supabase.rpc(
      'get_random_dairy_joke'
      , {})

    if (error) {
      return formatFail('每日笑话：接口出错！', error)
    } else {
      const content = data[0].content;
      // ✅ 根据 format 参数决定返回格式
      if (format === 'text') {
        return content
      }
      return formatSuccess(data[0].content);
    }
  } catch (error) {
    return formatFail(error?.message || '获取每日笑话失败')
  }
})