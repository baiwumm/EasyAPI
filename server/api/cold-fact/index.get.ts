/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-25 21:41:04
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-26 10:37:35
 * @Description: 每日冷知识
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'
import { pick } from '~/lib/utils'
import type { RandomRecord } from '~/lib/type'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  const format = query.format || 'standard' // 默认返回标准格式
  try {
    const { data, error } = await supabase.rpc('get_random_cold_fact')

    if (error) {
      return formatFail('每日冷知识：接口出错！', error)
    } else {
      const content = (data as RandomRecord).content;
      // ✅ 根据 format 参数决定返回格式
      if (format === 'text') {
        return content
      }
      return formatSuccess(pick(data, ['content', 'category', 'source']));
    }
  } catch (error) {
    return formatFail((error as Error)?.message || '获取每日冷知识失败')
  }
})