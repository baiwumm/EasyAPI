/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-05 10:09:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-05 10:11:00
 * @Description: 稀土掘金热榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`稀土掘金热榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.err_msg === 'success') {
      const result = responseBody.data.map((v: Record<string, any>) => {
        return {
          id: v.content.content_id,
          title: v.content.title,
          hot: v.content_counter.hot_rank,
          url: `https://juejin.cn/post/${v.content.content_id}`,
          mobileUrl: `https://juejin.cn/post/${v.content.content_id}`,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '稀土掘金热榜接口异常')
  }
})