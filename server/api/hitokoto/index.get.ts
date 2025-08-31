/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-21 09:47:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-31 11:14:43
 * @Description: 每日一言
 */
import { formatSuccess, formatFail } from '~/lib/constant'
import { serverSupabaseClient } from '#supabase/server'

type Hitokoto = {
  id: string
  content: string
  type: string
  from: string | null
  from_who: string | null
  creator: string | null
  length: number
  commit_from: string | null
}

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  // ✅ 参数处理
  const types = query.type ? (query.type as string).split(',') : null
  const minLength = query.minLength ? Number(query.minLength) : null
  const maxLength = query.maxLength ? Number(query.maxLength) : null
  const format = query.format as string | undefined
  try {
    // 调用自定义 RPC
    const { data, error } = await supabase.rpc('get_random_hitokoto', {
      types,
      minlength: minLength,
      maxlength: maxLength,
    })

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
