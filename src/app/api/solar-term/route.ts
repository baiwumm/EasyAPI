/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-05 09:30:46
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-05 09:36:26
 * @Description: 二十四节气
 */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Lunar } from 'lunar-typescript';
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

dayjs.extend(customParseFormat)

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const year = Number(searchParams.get('year') || dayjs().year());

    const isValid = /^\d{4}$/.test(String(year)) && year >= 1900 && year <= 2100;

    // 校验格式
    if (!isValid) {
      return NextResponse.json(responseMessage(null, '请输入合法的 YYYY 年份，只支持 1900 ~ 2100', RESPONSE.ERROR))
    }

    const d = Lunar.fromYmd(year, 1, 1);
    // 获取当年的节气名称（按时间先后排序）
    const l = d.getJieQiList();

    const solarTermEnum: Record<string, string> = {
      'DA_XUE': '大雪',
      'DONG_ZHI': '冬至',
      'XIAO_HAN': '小寒',
      'DA_HAN': '大寒',
      'LI_CHUN': '立春',
      'YU_SHUI': '雨水',
      'JING_ZHE': '惊蛰',
    }

    const jieQi = d.getJieQiTable();
    // 获取当年的节气表（键值对方式，键为节气名称，值为对应阳历。）
    const result = [];
    for (let i = 0, j = l.length; i < j; i++) {
      const name = l[i];
      result.push({
        name: solarTermEnum[name] || name,
        date: jieQi[name].toYmdHms()
      })
    }

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}