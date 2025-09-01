/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-01 14:11:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-01 14:20:52
 * @Description: 中文诗词
 */
import { formatSuccess, formatFail } from '~/lib/constant'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event);
  const author = query.author || null;  // 如果有传入author字段，使用，否则为null
  try {
    const { data, error } = await supabase
      .rpc('get_random_chinese_poetry', { author_param: author });

    if (error) {
      return formatFail('中文诗词：接口出错！', error)
    }
    return formatSuccess(data);
  } catch (error) {
    return formatFail((error as Error)?.message || '获取中文诗词失败')
  }
})