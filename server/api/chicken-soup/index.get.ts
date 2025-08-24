/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-24 18:18:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-24 20:52:18
 * @Description: 毒鸡汤
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  const format = query.format || 'standard' // 默认返回标准格式
  try {
    const { data, error } = await supabase.rpc(
      'get_random_chicken_soup'
      , {})

    if (error) {
      return formatFail('毒鸡汤：接口出错！', error)
    } else {
      const content = data[0].content;
      // ✅ 根据 format 参数决定返回格式
      if (format === 'text') {
        return content
      }
      return formatSuccess(content);
    }
  } catch (error) {
    return formatFail(error?.message || '获取毒鸡汤失败')
  }
})