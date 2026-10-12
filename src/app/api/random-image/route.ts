/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-13 09:20:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 17:57:19
 * @Description: 随机图片
 */
import type { NextRequest } from "next/server";

import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

import { catchError, parseBoundedInt, responseMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = new URL(request.url);

    const count = parseBoundedInt(searchParams.get("count"), 5, 1, 20);
    const width = parseBoundedInt(searchParams.get("width"), 128, 16, 1024);
    const height = parseBoundedInt(searchParams.get("height"), 128, 16, 1024);

    // 真实照片源：faker.image.url() 输出 picsum.photos 的 seed 地址。
    // faker v10 起 image.url() 已从 loremflickr（现已 401 不可用）切换到 picsum，
    // 与升级前的旧实现同款写法。曾改为服务端生成抽象 SVG（G8），但观感单一、
    // 不是照片，2026-10-12 换回。第三方不可用时整页图片会挂，由 GridReveal 的
    // onerror 重试与灰色揭幕降级兜底
    const images = Array.from({ length: count }, () =>
      faker.image.url({ width, height }),
    );

    return NextResponse.json(responseMessage(images));
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}
