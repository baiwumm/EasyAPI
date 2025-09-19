/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-23 21:12:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-23 22:15:18
 * @Description: bind 每日壁纸
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  try {
    const response = await fetch(
      "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
    );

    if (!response.ok) {
      return formatFail(`bind每日壁纸 接口出错：HTTP ${response.status}`)
    }

    const responseBody = await response.json();

    const img = responseBody.images?.[0];

    const getUrl = (url: string) => {
      const id = (new URL(url).searchParams.get('id') || '').replace(/_\d+x\d+\.jpg$/, '')
      return `https://bing.com/th?id=${id}_1920x1080.jpg`
    }

    // https://cn.bing.com//th?id=OHR.GipuzcoaSummer_ZH-CN1926924422_UHD.jpg
    // https://cn.bing.com/th?id=OHR.GipuzcoaSummer_ZH-CN1926924422_1920x1080.jpg
    const get4kUrl = (url: string) => {
      const id = (new URL(url).searchParams.get('id') || '').replace(/_\d+x\d+\.jpg$/, '')
      return `https://bing.com/th?id=${id}_UHD.jpg`
    }

    const url = `https://bing.com${img.url}`;

    const result = {
      url: getUrl(url),
      url_4k: get4kUrl(url),
      title: img.title,
      copyright: img.copyright,
    }

    // ✅ 根据 format 参数决定返回格式
    if (query.format === 'text') {
      return getUrl(url)
    }

    return formatSuccess(result);
  } catch (error) {
    return formatFail((error as Error)?.message || '获取bind每日壁纸失败')
  }
})