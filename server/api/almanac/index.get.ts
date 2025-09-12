/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-12 20:08:53
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-12 21:33:03
 * @Description: 十二时辰黄历
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import dayjs from "dayjs"
import { Solar, Lunar, LunarUtil } from 'lunar-typescript';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const date = (query.date as string) || dayjs().format('YYYY-MM-DD');
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    if (!regex.test(date)) {
      return formatFail("请输入合法的日期！");
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

    return formatSuccess(result);
  } catch (error) {
    return formatFail((error as Error)?.message || "十二时辰黄历查询失败");
  }
});