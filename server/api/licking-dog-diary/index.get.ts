/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-24 10:38:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-24 10:42:40
 * @Description: 舔狗日记
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const format = query.format || 'standard' // 默认返回标准格式

  try {
    const response = await fetch(
      "https://api.52vmy.cn/api/wl/yan/tiangou"
    );

    if (!response.ok) {
      return formatFail('舔狗日记：接口出错！', response.status)
    }

    const responseBody = await response.json();

    const result = responseBody.content;

    if (responseBody.code === 200) {
      // ✅ 根据 format 参数决定返回格式
      if (format === 'text') {
        return result
      }
      return formatSuccess(result);
    }
    return formatFail('获取舔狗日记失败')
  } catch (error) {
    return formatFail(error?.message || '获取舔狗日记失败')
  }
})