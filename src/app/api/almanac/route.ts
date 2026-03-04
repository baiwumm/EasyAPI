/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 16:31:38
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-04 16:40:36
 * @Description: 
 */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Lunar, LunarUtil, Solar } from 'lunar-typescript';
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

dayjs.extend(customParseFormat)

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || dayjs().format('YYYY-MM-DD');

    // 校验格式
    if (!dayjs(date, 'YYYY-MM-DD', true).isValid()) {
      return NextResponse.json(responseMessage(null, '请输入合法的 YYYY-MM-DD 日期', RESPONSE.ERROR))
    }

    const solarInstance = Solar.fromDate(new Date(date));
    const lunarInstance = solarInstance.getLunar();

    // 公历
    const solarYear = solarInstance.getYear();
    const solarMonth = solarInstance.getMonth();

    // 农历
    const lunarYear = lunarInstance.getYear();
    const lunarMonth = lunarInstance.getMonth();
    const lunarDay = lunarInstance.getDay();

    const result = [];
    for (let i = 0; i < 24; i += 2) {
      const middleHour = i + 2 >= 24 ? 24 - (i + 2) : i + 2;
      const lunarInstance = Lunar.fromYmdHms(lunarYear, lunarMonth, lunarDay, middleHour, 0, 0);
      /**
      * 格式化成两位数
      * @param {Number} val
      * @returns {String}
      */
      const formatTwoDigit = (val: number) => {
        return val.toString().padStart(2, '0');
      }
      const row = {
        date: `${solarYear}-${solarMonth}-${solarInstance.getDay()}`,
        hours: `${formatTwoDigit(i + 1)}:00-${formatTwoDigit(middleHour)}:59`,
        hour: LunarUtil.convertTime(`${formatTwoDigit(middleHour)}:00`) + '时', // 时辰
        yi: lunarInstance.getTimeYi().join(' '), // 时宜
        ji: lunarInstance.getTimeJi().join(' '), // 时忌
        chong: '生肖冲' + lunarInstance.getTimeChongDesc(), // 时冲,
        sha: '煞' + lunarInstance.getTimeSha(), // 时煞
        nayin: lunarInstance.getTimeNaYin(), // 纳音
        jiuxing: lunarInstance.getTimeNineStar().toString() // 九星
      };
      result.push(row);
    }

    result.unshift(result.pop()); // 将子时提前

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}