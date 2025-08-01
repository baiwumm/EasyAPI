/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-01 15:30:25
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-01 15:49:48
 * @Description: 微博热搜
 */
import type { NewsResponse } from '~/lib/type'
import { RESPONSE_STATUS_CODE } from '~/lib/enum'

export default defineEventHandler(async (event) => {
  // 官方 url
  const url = 'https://weibo.com/ajax/side/hotSearch';
  try {
    // 请求数据
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://weibo.com/',
        'Accept': 'application/json',
      }
    });
    console.log('response', response)
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      throw createError(`微博-热搜榜：接口出错！`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.ok === 1) {
      const result: NewsResponse[] = responseBody.data.realtime.map((v: Record<string, any>) => {
        const key = v.word_scheme ? v.word_scheme : `#${v.word}`;
        return {
          id: v.mid,
          title: v.word,
          desc: key,
          hot: v.raw_hot,
          label: v.label_name,
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
          mobileUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
        };
      });
      // 请求成功
      return {
        code: RESPONSE_STATUS_CODE.SUCCESS,
        msg: '请求成功',
        data: result
      }
    }
    // 请求失败
    return {
      code: RESPONSE_STATUS_CODE.SERVER_ERROR,
      msg: '请求失败',
      data: []
    }
  } catch (error) {
    throw createError(error.message)
  }
})