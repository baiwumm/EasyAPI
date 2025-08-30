/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-21 09:47:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-30 13:55:52
 * @Description: 每日一言
 */
import { formatSuccess, formatFail } from '~/lib/constant'
import { serverSupabaseClient } from '#supabase/server'

type Hitokoto = {
  id: string;
  content: string;
  type: string;
}


export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  // 获取 type, format 参数
  const types = query.type ? (query.type as string).split(',') : []
  const format = query.format
  try {
    // 调用自定义的 RPC 函数获取随机数据
    const { data, error } = await supabase.rpc('get_random_hitokoto', { types });

    if (error) {
      return formatFail('每日一言：接口出错！', error)
    }
    // ✅ 根据 format 参数决定返回格式
    if (format === 'text') {
      return (data as Hitokoto).content
    }
    return formatSuccess(data);
  } catch (error) {
    return formatFail((error as Error)?.message || '获取每日一言失败')
  }
})
