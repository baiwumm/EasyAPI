/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-05 16:14:33
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-05 16:15:44
 * @Description: 澎湃新闻热榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`澎湃新闻热榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.resultCode === 1) {
      const result = responseBody.data.hotNews.map((v: Record<string, any>) => {
        return {
          id: v.contId,
          title: v.name,
          pic: v.pic,
          hot: v.praiseTimes,
          url: `https://www.thepaper.cn/newsDetail_forward_${v.contId}`,
          mobileUrl: `https://m.thepaper.cn/newsDetail_forward_${v.contId}`,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '澎湃新闻热榜接口异常')
  }
})