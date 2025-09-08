/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-05 09:11:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-05 09:12:39
 * @Description: 骂人宝典（祖安语录）
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'
import type { RandomRecord } from '~/lib/type'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  try {
    const { data, error } = await supabase.rpc('get_random_swearing')

    if (error) {
      return formatFail('骂人宝典（祖安语录）：接口出错！', error)
    } else {
      const content = (data as RandomRecord).content;
      // ✅ 根据 format 参数决定返回格式
      if (query.format === 'text') {
        return content
      }
      return formatSuccess(content);
    }
  } catch (error) {
    return formatFail((error as Error)?.message || '获取骂人宝典（祖安语录）失败')
  }
})