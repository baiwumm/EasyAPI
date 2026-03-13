/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 11:10:49
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 17:55:04
 * @Description: 随机人物肖像
 */
import { fakerZH_CN as faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from 'next/server'

import { PERSON_SEXS, PERSON_SIZES, RESPONSE } from '@/enums';
import { catchError, clamp, responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = new URL(request.url);
    const count = clamp(parseInt(searchParams.get("count") || "5"), 1, 20)
    const sex = (searchParams.get("sex") || PERSON_SEXS.GENERIC) as typeof PERSON_SEXS.valueType;
    const size = (searchParams.get("size") || PERSON_SIZES.SIZE_128);

    if (!PERSON_SEXS.values.includes(sex)) {
      return NextResponse.json(responseMessage(null, `参数 sex 必须是 ${PERSON_SEXS.labels.join("、")}`, RESPONSE.ERROR));
    }

    if (!PERSON_SIZES.values.includes(Number(size) as typeof PERSON_SIZES.valueType)) {
      return NextResponse.json(responseMessage(null, `参数 size 必须是 ${PERSON_SIZES.labels.join("、")}`, RESPONSE.ERROR));
    }

    const images = Array.from({ length: count }, () => faker.image.personPortrait({ sex, size: size as typeof PERSON_SIZES.valueType }));

    return NextResponse.json(responseMessage(images))
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}