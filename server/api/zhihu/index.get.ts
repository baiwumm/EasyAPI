/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-01 14:35:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-01 14:37:07
 * @Description: 知乎热榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://api.zhihu.com/topstory/hot-list');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`知乎-热榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.data) {
      const result = responseBody.data.map((v: Record<string, any>) => {
        return {
          id: v.id,
          title: v.target.title,
          pic: v.children[0].thumbnail,
          hot: parseInt(v.detail_text.replace(/[^\d]/g, '')) * 10000,
          url: `https://www.zhihu.com/question/${v.card_id.replace('Q_', '')}`,
          mobileUrl: `https://www.zhihu.com/question/${v.card_id.replace('Q_', '')}`,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '知乎热榜接口异常')
  }
})