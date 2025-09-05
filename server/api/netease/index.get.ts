/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-05 10:17:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-05 10:18:40
 * @Description: 网易新闻热榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://m.163.com/fe/api/hot/news/flow');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`网易新闻热榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.msg === 'success') {
      const result = responseBody.data.list.map((v: Record<string, any>) => {
        return {
          id: v.skipID,
          title: v.title,
          desc: v._keyword,
          pic: v.imgsrc,
          url: `https://www.163.com/dy/article/${v.skipID}.html`,
          mobileUrl: v.url,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '网易新闻热榜接口异常')
  }
})