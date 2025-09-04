/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-04 17:02:56
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-04 17:03:37
 * @Description: 百度热搜榜
 */
import type { NewsResponse } from '~/lib/type'
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const url = 'https://top.baidu.com/api/board?platform=wise&tab=realtime'
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return formatFail(`百度热搜榜 接口出错：HTTP ${response.status}`)
    }

    const responseBody = await response.json()
    if (responseBody.success) {
      const result: NewsResponse[] = responseBody.data.cards[0].content.map((v: any, index: number) => {
        return {
          id: index + v.hotScore,
          title: v.word,
          desc: v.desc,
          pic: v.img,
          hot: Number(v.hotScore),
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(v.query)}`,
          mobileUrl: v.url,
        };
      })
      return formatSuccess(result);
    }
    return formatFail();
  } catch (error) {
    return formatFail((error as Error)?.message || '百度热搜榜接口异常')
  }
})