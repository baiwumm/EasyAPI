/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-25 09:14:05
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-26 10:41:50
 * @Description: 今日诗词
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  try {
    const response = await fetch("https://v1.jinrishici.com/all.json");

    if (!response.ok) {
      return formatFail(`今日诗词 接口出错：HTTP ${response.status}`)
    }

    const responseBody = await response.json();

    // ✅ 根据 format 参数决定返回格式
    if (query.format === 'text') {
      return responseBody.content
    }

    return formatSuccess(responseBody);
  } catch (error) {
    return formatFail((error as Error)?.message || '获取今日诗词失败')
  }
})