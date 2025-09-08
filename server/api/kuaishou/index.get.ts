/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-08 15:57:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-08 15:59:29
 * @Description: 快手热榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'
import type { NewsResponse } from '~/lib/type'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://www.kuaishou.com/?isHome=1');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`快手热榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.text();
    // 处理数据
    const result: NewsResponse[] = [];
    const pattern = /window.__APOLLO_STATE__=(.*);\(function\(\)/s;
    const idPattern = /clientCacheKey=([A-Za-z0-9]+)/s;
    const matchResult = responseBody.match(pattern);
    const jsonObject = matchResult ? JSON.parse(matchResult[1])['defaultClient'] : [];

    // 获取所有分类
    const allItems = jsonObject['$ROOT_QUERY.visionHotRank({"page":"home"})']['items'];
    // 遍历所有分类
    allItems.forEach((v: Record<string, any>) => {
      // 基础数据
      const image = jsonObject[v.id]['poster'];
      const id = image.match(idPattern)[1];
      // 数据处理
      result.push({
        id,
        title: jsonObject[v.id]['name'],
        hot: jsonObject[v.id]['hotValue']?.replace('万', '') * 10000,
        url: `https://www.kuaishou.com/short-video/${id}`,
        mobileUrl: `https://www.kuaishou.com/short-video/${id}`,
      });
    });
    return formatSuccess(result)
  } catch (error) {
    return formatFail((error as Error)?.message || '快手热榜接口异常')
  }
})