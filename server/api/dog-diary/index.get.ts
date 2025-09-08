/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-24 10:38:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-26 10:43:00
 * @Description: 舔狗日记
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'
import type { RandomRecord } from '~/lib/type'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  try {
    const { data, error } = await supabase.rpc('get_random_dog_diary')

    if (error) {
      return formatFail('舔狗日记：接口出错！', error)
    } else {
      const content = (data as RandomRecord).content;
      // ✅ 根据 format 参数决定返回格式
      if (query.format === 'text') {
        return content
      }
      return formatSuccess(content);
    }
  } catch (error) {
    return formatFail((error as Error)?.message || '获取舔狗日记失败')
  }
})