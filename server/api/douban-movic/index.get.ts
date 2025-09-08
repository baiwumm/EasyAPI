/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-08 16:14:13
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-08 16:17:32
 * @Description: 豆瓣电影新片榜
 */
import { formatSuccess, formatFail } from '~/lib/constant'
import type { NewsResponse } from '~/lib/type'
import * as cheerio from 'cheerio';

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://movie.douban.com/chart/');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`豆瓣电影新片榜 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.text();
    // 处理数据
    const getNumbers = (text: string | undefined) => {
      if (!text) return 10000000;
      const regex = /\d+/;
      const match = text.match(regex);
      if (match) {
        return Number(match[0]);
      } else {
        return 10000000;
      }
    };
    const $ = cheerio.load(responseBody);
    const listDom = $('.article tr.item');
    const result: NewsResponse[] = listDom.toArray().map((item) => {
      const dom = $(item);
      const url = dom.find('a').attr('href') || '';
      const score = dom.find('.rating_nums').text() ?? '0.0';
      return {
        id: String(getNumbers(url)),
        title: `${dom.find('.pl2 a').text().replace(/\s+/g, ' ').trim().replace(/\n/g, '')}`,
        desc: dom.find('p.pl').text(),
        hot: getNumbers(dom.find('span.pl').text()),
        score: Number(score),
        url,
        mobileUrl: `https://m.douban.com/movie/subject/${getNumbers(url)}/`,
      };
    });
    return formatSuccess(result)
  } catch (error) {
    return formatFail((error as Error)?.message || '豆瓣电影新片榜接口异常')
  }
})