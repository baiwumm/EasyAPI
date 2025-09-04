/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-04 16:53:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-04 17:00:07
 * @Description: 抖音热点榜
 */
import type { NewsResponse } from '~/lib/type'
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const url = 'https://aweme.snssdk.com/aweme/v1/hot/search/list/'
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return formatFail(`抖音热点榜 接口出错：HTTP ${response.status}`)
    }

    const responseBody = await response.json()
    if (responseBody.status_code === 0) {
      const result: NewsResponse[] = responseBody.data.word_list.map((v: any) => {
        return {
          id: v.group_id,
          title: v.word,
          pic: `${v.word_cover.url_list[0]}`,
          hot: Number(v.hot_value),
          url: `https://www.douyin.com/hot/${encodeURIComponent(v.sentence_id)}`,
          mobileUrl: `https://www.douyin.com/hot/${encodeURIComponent(v.sentence_id)}`,
        };
      })
      return formatSuccess(result);
    }
    return formatFail();
  } catch (error) {
    return formatFail((error as Error)?.message || '抖音热点榜接口异常')
  }
})