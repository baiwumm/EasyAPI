/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-14 17:33:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-14 22:56:42
 * @Description: 二十四节气
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import dayjs from "dayjs"
import { Lunar } from 'lunar-typescript';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const year = Number(query.year || dayjs().year());

    // 判断年份是否合法
    const regex = /^\d{4}$/
    if (!regex.test(year.toString())) {
      return formatFail("请输入合法的年份，YYYY 格式！");
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
    return formatSuccess(result);
  } catch (error) {
    return formatFail((error as Error)?.message || "二十四节气查询失败");
  }
});