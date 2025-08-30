/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-30 23:50:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-31 00:14:32
 * @Description: 今日头条热榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`今日头条-热榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.status === 'success') {
      const result = responseBody.data.map((v: Record<string, any>) => {
        return {
          id: v.ClusterId,
          title: v.Title,
          pic: v.Image.url,
          hot: v.HotValue,
          url: `https://www.toutiao.com/trending/${v.ClusterIdStr}/`,
          mobileUrl: `https://api.toutiaoapi.com/feoffline/amos_land/new/html/main/index.html?topic_id=${v.ClusterIdStr}`,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '今日头条热榜接口异常')
  }
})