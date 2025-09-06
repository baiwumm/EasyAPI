/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-07 01:20:16
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-07 01:29:55
 * @Description: 歇后语
 */
import { formatSuccess, formatFail } from '~/lib/constant';
import { serverSupabaseClient } from '#supabase/server'
import { pick } from '~/utils'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  try {
    const { data, error } = await supabase.rpc('get_random_riddle')
    if (error) {
      return formatFail('歇后语：接口出错！', error)
    } else {
      return formatSuccess(pick(data, ['riddle', 'answer']));
    }
  } catch (error) {
    return formatFail((error as Error)?.message || '获取歇后语失败')
  }
})