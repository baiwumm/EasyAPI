/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-05 09:24:17
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-05 09:24:41
 * @Description: 腾讯新闻热点榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://r.inews.qq.com/gw/event/hot_ranking_list');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`腾讯新闻热点榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.ret === 0) {
      const result = responseBody.idlist[0].newslist.slice(1).map((v: Record<string, any>) => {
        return {
          id: v.id,
          title: v.title,
          desc: v.abstract,
          pic: v.miniProShareImage,
          hot: v.readCount,
          url: `https://new.qq.com/rain/a/${v.id}`,
          mobileUrl: `https://view.inews.qq.com/a/${v.id}`,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '腾讯新闻热点榜接口异常')
  }
})