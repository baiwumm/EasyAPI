import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { catchError, responseMessage } from "@/lib/utils";

// 合理量程：超出视为误输入，避免 height=0 之类的边界算出 Infinity
const MAX_HEIGHT = 300; // cm
const MAX_WEIGHT = 500; // kg

// 分级阈值（WHO 标准）。注意：前端 bmi/ClientComponent.tsx 的 isNormal
// 判定区间是 [18.5, 23.9]，与这里「< BMI_OVERWEIGHT 即正常体重」对应，
// 调整任一侧阈值时必须同步另一侧，否则会出现后端说「正常」前端标红
const BMI_UNDERWEIGHT = 18.5;
const BMI_OVERWEIGHT = 24.9;
const BMI_OBESE = 29.9;

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-04 17:59:07
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 15:42:22
 * @Description: BMI 计算器
 */

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;

    const height = searchParams.get("height");
    const weight = searchParams.get("weight");

    const heightNum = Number.parseFloat(height || "");
    const weightNum = Number.parseFloat(weight || "");

    if (
      !height ||
      !weight ||
      !Number.isFinite(heightNum) ||
      !Number.isFinite(weightNum)
    ) {
      return NextResponse.json(
        responseMessage(null, "请输入有效的身高和体重", RESPONSE.ERROR),
      );
    }

    // 必须为正数：height=0 会让分母为 0 得到 Infinity；
    // Number.parseFloat('175cm') 也很容易被悄悄接受成 175，需按量程挡掉
    if (heightNum <= 0 || heightNum > MAX_HEIGHT) {
      return NextResponse.json(
        responseMessage(
          null,
          `身高必须在 0 ~ ${MAX_HEIGHT} cm 之间`,
          RESPONSE.ERROR,
        ),
      );
    }

    if (weightNum <= 0 || weightNum > MAX_WEIGHT) {
      return NextResponse.json(
        responseMessage(
          null,
          `体重必须在 0 ~ ${MAX_WEIGHT} kg 之间`,
          RESPONSE.ERROR,
        ),
      );
    }

    // 身高 cm → m
    const heightInMeters = heightNum / 100;

    // 计算 BMI
    const bmi = weightNum / (heightInMeters * heightInMeters);

    let status = "";

    if (bmi < BMI_UNDERWEIGHT) {
      status = "体重过低";
    } else if (bmi < BMI_OVERWEIGHT) {
      status = "正常体重";
    } else if (bmi < BMI_OBESE) {
      status = "超重";
    } else {
      status = "肥胖";
    }

    return NextResponse.json(
      responseMessage({
        bmi: bmi.toFixed(2),
        status,
      }),
    );
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
