import { NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { catchError, responseMessage } from '@/lib/utils'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 17:59:07
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:42:22
 * @Description: BMI 计算器
 */
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams

    const height = searchParams.get('height')
    const weight = searchParams.get('weight')

    const heightNum = Number.parseFloat(height || '')
    const weightNum = Number.parseFloat(weight || '')

    if (!height || !weight || Number.isNaN(heightNum) || Number.isNaN(weightNum)) {
      return NextResponse.json(
        responseMessage(
          null,
          '请输入有效的身高和体重',
          RESPONSE.ERROR,
        ),
      )
    }

    // 身高 cm → m
    const heightInMeters = heightNum / 100

    // 计算 BMI
    const bmi = weightNum / (heightInMeters * heightInMeters)

    let status = ''
    if (bmi < 18.5) {
      status = '体重过低'
    }
    else if (bmi < 24.9) {
      status = '正常体重'
    }
    else if (bmi < 29.9) {
      status = '超重'
    }
    else {
      status = '肥胖'
    }

    return NextResponse.json(responseMessage({
      bmi: bmi.toFixed(2),
      status,
    }))
  }
  catch (err) {
    return NextResponse.json(catchError(err))
  }
}
