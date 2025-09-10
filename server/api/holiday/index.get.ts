/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-09 17:50:07
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-09 18:03:52
 * @Description: 法定节假日
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import dayjs from "dayjs"
import { isNumber } from '~/utils'
import { HolidayUtil } from 'lunar-typescript';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const year = query.year ? Number(query.year) : dayjs().year();
    const holidays = HolidayUtil.getHolidays(year);
    const result: Record<string, any> = {};
    if (!isNumber(year)) {
      return formatFail("请输入合法的年份！");
    }
    /**
   * 获取假期长度
   * @param {string} start 开始日期
   * @param {string} end 结束日期
   * @returns {number}
   */
    const getLength = (start: string, end: string) => {
      const startDay = dayjs(start);
      const endDay = dayjs(end);

      return endDay.diff(startDay, 'day') + 1;
    }

    /**
     * 获取假期余额
     * @param {string} start 开始日期
     * @param {string} end 结束日期
     * @returns {number}
     */
    const getBalance = (start: string, end: string) => {
      const startDay = dayjs(start);
      const endDay = dayjs(end);
      const today = dayjs();

      if (today.isBefore(startDay)) {
        return getLength(start, end);
      }

      if (today.isAfter(endDay)) {
        return 0;
      }

      return endDay.diff(today, 'day') + 1;
    }
    holidays.forEach((holiday) => {
      const name = holiday.getName();
      const target = holiday.getTarget();
      const isWork = holiday.isWork();
      const day = holiday.getDay();

      result[name] = result[name] || {};

      if (!isWork && dayjs(target).year() === year) {
        const distance = dayjs(target).diff(dayjs().startOf('day'), 'day');
        const start = result[name]?.start || day;
        result[name] = {
          name,
          start,
          end: day,
          distance,
          length: getLength(start, day),
          balance: getBalance(start, day)
        };
      }
      result[name].work = isWork ? [...(result[name]?.work || []), day] : [];
    });
    return formatSuccess(Object.values(result))
  } catch (error) {
    return formatFail((error as Error)?.message || "法定节假日查询失败");
  }
});