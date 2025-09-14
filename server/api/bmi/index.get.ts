/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-14 06:43:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-14 07:05:31
 * @Description: BMI 计算器
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    const { height, weight } = getQuery(event);
    // 判断是否是有效的数字字符串
    const heightNum = parseFloat(height as string);
    const weightNum = parseFloat(weight as string);

    if (!height || !weight || isNaN(heightNum) || isNaN(weightNum)) {
      return {
        status: 'error',
        message: '请输入有效的身高和体重'
      };
    }

    // 身高（cm）转化为米（m）
    const heightInMeters = heightNum / 100;

    // 计算 BMI
    const bmi = weightNum / (heightInMeters * heightInMeters);

    // 判断身体状况
    let status = '';
    if (bmi < 18.5) {
      status = '体重过低';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      status = '正常体重';
    } else if (bmi >= 25 && bmi < 29.9) {
      status = '超重';
    } else {
      status = '肥胖';
    }
    return formatSuccess({
      bmi: bmi.toFixed(2),
      status
    });
  } catch (error) {
    return formatFail((error as Error)?.message || 'BMI 计算器接口异常')
  }
})