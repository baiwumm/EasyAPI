/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-02 22:25:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-02 22:26:12
 * @Description: 疯狂星期四
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'
import type { RandomRecord } from '~/lib/type'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  const format = query.format || 'standard' // 默认返回标准格式
  try {
    const { data, error } = await supabase.rpc('get_random_kfc')

    if (error) {
      return formatFail('疯狂星期四：接口出错！', error)
    } else {
      const content = (data as RandomRecord).content;
      // ✅ 根据 format 参数决定返回格式
      if (format === 'text') {
        return content
      }
      return formatSuccess(content);
    }
  } catch (error) {
    return formatFail((error as Error)?.message || '获取疯狂星期四失败')
  }
})