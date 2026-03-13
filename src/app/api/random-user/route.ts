/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 10:24:39
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 14:47:40
 * @Description: 随机用户
 */
import { fakerZH_CN as faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from 'next/server'

import { RANDOM_USER_GENDER } from '@/enums';
import { catchError, responseMessage } from '@/lib/utils'

function createUser(gender: string | null) {
  const sex =
    gender === RANDOM_USER_GENDER.MALE || gender === RANDOM_USER_GENDER.FEMALE
      ? gender
      : faker.helpers.arrayElement([RANDOM_USER_GENDER.MALE, RANDOM_USER_GENDER.FEMALE]);

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName({ sex }),
    gender: RANDOM_USER_GENDER.label(sex) || '未知',
    username: faker.internet.username(),
    phone: `1${faker.string.numeric(10)}`,
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate().toISOString().split("T")[0],
    address: {
      province: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      zipCode: faker.location.zipCode()
    },
    company: faker.company.name(),
    job: faker.person.jobTitle(),
    website: faker.internet.url(),
    ip: faker.internet.ipv4(),
    createdAt: faker.date.recent()
  };
}

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = new URL(request.url);

    const count = Math.min(Number(searchParams.get("count")) || 1, 20);
    const gender = searchParams.get("gender");

    const users = Array.from({ length: count }, () => createUser(gender));

    return NextResponse.json(responseMessage(users))
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}