/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 09:20:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 17:57:19
 * @Description: 随机图片
 */
import type { NextRequest } from "next/server";

import cryptoRandomString from "crypto-random-string";
import { NextResponse } from "next/server";

import { generateRandomImageSvg } from "@/lib/server/random-image-art";
import { catchError, parseBoundedInt, responseMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = new URL(request.url);

    const count = parseBoundedInt(searchParams.get("count"), 5, 1, 20);
    const width = parseBoundedInt(searchParams.get("width"), 128, 16, 1024);
    const height = parseBoundedInt(searchParams.get("height"), 128, 16, 1024);

    // G8：不再返回第三方 loremflickr 外链（第三方不可用则整页图片全废），
    // 改为本地生成确定性 SVG 的 data URI。一次请求全部直出、图片不再单独走
    // /api/* 中间件——与 random-avatar 批量的 F6 决策一致
    const images = Array.from({ length: count }, () => {
      const seed = cryptoRandomString({ length: 8 });
      const svg = generateRandomImageSvg(seed, width, height);

      return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
    });

    return NextResponse.json(responseMessage(images));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
