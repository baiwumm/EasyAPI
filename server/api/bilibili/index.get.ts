/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-04 16:15:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-04 16:35:54
 * @Description: 哔哩哔哩热门榜
 */
import type { NewsResponse } from '~/lib/type'
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const url = 'https://api.bilibili.com/x/web-interface/ranking/v2'
  try {
    const response = await fetch(url, {
      headers: {
        Referer: `https://www.bilibili.com/ranking/all`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      return formatFail(`哔哩哔哩热门榜 接口出错：HTTP ${response.status}`)
    }

    const responseBody = await response.json()
    const data = responseBody?.data?.realtime || responseBody?.data?.list;
    if (!data) {
      return formatFail();
    }
    const result: NewsResponse[] = data.map((v: any) => {
      return {
        id: v.bvid,
        title: v.title,
        desc: v.desc,
        pic: v.pic.replace(/http:/, 'https:'),
        hot: v.stat.view,
        url: v.short_link_v2 || `https://b23.tv/${v.bvid}`,
        mobileUrl: `https://m.bilibili.com/video/${v.bvid}`,
      };
    })
    return formatSuccess(result);
  } catch (error) {
    return formatFail((error as Error)?.message || '哔哩哔哩热门榜接口异常')
  }
})