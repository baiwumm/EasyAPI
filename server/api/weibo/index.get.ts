/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-01 15:30:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-21 09:37:52
 * @Description: 微博热搜
 */
import type { NewsResponse } from '~/lib/type'
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const format = query.format || 'standard' // 默认返回标准格式

  const url = 'https://weibo.com/ajax/side/hotSearch'
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://weibo.com/',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return formatFail('微博-热搜榜：接口出错！', response.status)
    }

    const responseBody = await response.json()

    if (responseBody.ok === 1) {
      const result: NewsResponse[] = responseBody.data.realtime.map((v: any) => {
        const key = v.word_scheme ? v.word_scheme : `#${v.word}`
        return {
          id: v.mid,
          title: v.word,
          desc: key,
          hot: v.raw_hot,
          label: v.label_name,
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
          mobileUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
        }
      })

      // ✅ 根据 format 参数决定返回格式
      if (format === 'json') {
        return result
      }

      return formatSuccess(result);
    }

    return formatFail();
  } catch (error: any) {
    return formatFail(error?.message || '微博热搜接口异常')
  }
})
