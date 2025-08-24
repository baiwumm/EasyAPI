/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-24 20:58:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-24 21:13:44
 * @Description: 处理调用次数中间件
 */
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  try {
    const reqUrl = event.node.req.url || ''
    // 去掉 /api 前缀，并且去掉查询参数
    const reqPath = reqUrl.replace(/^\/api/, '').split('?')[0]

    // 先查 ea_apis 表，看有没有 path 匹配当前请求
    const { data } = await supabase
      .from('ea_apis')
      .select('id, path')
      .eq('path', reqPath)
      .limit(1)
      .single()

    if (data) {
      // 调用 RPC 函数随机增加 call_count 1~5
      const increment = Math.floor(Math.random() * 5) + 1
      await supabase.rpc('increment_call_count', {
        row_id: data.id,
        inc: increment
      })
    }
  } catch (error) {
    console.error('call-count middleware error:', error)
  }
})
