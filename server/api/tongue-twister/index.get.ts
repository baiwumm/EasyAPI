/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-26 17:00:36
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-08 09:19:26
 * @Description: 每日绕口令
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'
import type { RandomRecord } from '~/lib/type'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  try {
    const { data, error } = await supabase.rpc('get_random_tongue_twister')

    if (error) {
      return formatFail('每日绕口令：接口出错！', error)
    } else {
      const content = (data as RandomRecord).content;
      // ✅ 根据 format 参数决定返回格式
      if (query.format === 'text') {
        return content
      }
      return formatSuccess(content);
    }
  } catch (error) {
    return formatFail((error as Error)?.message || '获取每日绕口令失败')
  }
})