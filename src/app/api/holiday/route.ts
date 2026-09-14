/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 15:55:05
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:49:05
 * @Description: 法定节假日
 */
import type { NextRequest } from "next/server";

import dayjs from "dayjs";
import { HolidayUtil } from "lunar-typescript";
import { NextResponse } from "next/server";

import { catchError, responseMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const currentYear = dayjs().year();
    const minYear = 2022;

    // 仅在显式传入 year 时解析（Number(null) === 0 会被 clamp 到 minYear，导致默认返回 2022 年数据）
    const yearParam = searchParams.get("year");
    const rawYear = yearParam === null ? currentYear : Number(yearParam);
    const safeYear = Number.isNaN(rawYear) ? currentYear : rawYear;

    const year = Math.min(Math.max(safeYear, minYear), currentYear);
    const holidays = HolidayUtil.getHolidays(year);
    const result: Record<string, any> = {};

    /**
     * 获取假期长度
     * @param {string} start 开始日期
     * @param {string} end 结束日期
     * @returns {number} 假期长度
     */
    const getLength = (start: string, end: string) => {
      const startDay = dayjs(start);
      const endDay = dayjs(end);

      return endDay.diff(startDay, "day") + 1;
    };

    /**
     * 获取假期余额
     * @param {string} start 开始日期
     * @param {string} end 结束日期
     * @returns {number} 假期余额
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

      return endDay.diff(today, "day") + 1;
    };

    holidays.forEach((holiday) => {
      const name = holiday.getName();
      const target = holiday.getTarget();
      const isWork = holiday.isWork();
      const day = holiday.getDay();

      result[name] = result[name] || {};

      if (!isWork && dayjs(target).year() === year) {
        const distance = dayjs(target).diff(dayjs().startOf("day"), "day");
        const start = result[name]?.start || day;

        result[name] = {
          name,
          start,
          end: day,
          distance,
          length: getLength(start, day),
          balance: getBalance(start, day),
        };
      }
      result[name].work = isWork ? [...(result[name]?.work || []), day] : [];
    });

    return NextResponse.json(responseMessage(Object.values(result)));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
