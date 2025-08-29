/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-29 17:00:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-29 17:21:03
 * @Description: 历史上的今天
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const time = (query.time || '') as string;
    let month = '', day = '';
    // 验证日期格式
    const timeRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (time && !timeRegex.test(time)) {
      return formatFail('参数格式不对，请使用 MM-DD 的形式，例如：01-01')
    }
    if (time) {
      [month, day] = time.split('-');
    } else {
      // 获取月份
      month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      // 获取天数
      day = new Date().getDate().toString().padStart(2, '0');
    }
    const url = `https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`;

    // 请求数据
    const res = await fetch(url);
    if (!res.ok) {
      return formatFail(`历史上的今天 接口出错：HTTP ${res.status}`)
    }
    // 得到请求体
    const responseBody = await res.json();
    // 处理数据
    const result = responseBody[month][month + day].map((v: Record<string, any>, index: number) => {
      return {
        id: index,
        title: v.title.replace(/<[^>]+>/g, ''),
        year: v.year,
        type: v.type,
        url: v.link,
        mobileUrl: v.link,
      };
    });
    return formatSuccess(result)
  } catch (error) {
    return formatFail((error as Error)?.message || '历史上的今天接口异常')
  }
})