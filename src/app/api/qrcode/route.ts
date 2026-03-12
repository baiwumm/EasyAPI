/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 15:03:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 09:40:41
 * @Description: 生成二维码
 */
import { NextRequest, NextResponse } from 'next/server'
import QRCode from "qrcode"

import { RESPONSE } from '@/enums'
import { catchError, responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = request.nextUrl;

    const text = searchParams.get("text") || "";
    const format = searchParams.get("format") || "png"; // png | svg | dataurl
    const size = parseInt(searchParams.get("size") || "256");

    // 参数校验
    if (!text || text.trim().length === 0) {
      return NextResponse.json(responseMessage(null, "参数 text 必填", RESPONSE.ERROR))
    }

    if (text.length > 2000) {
      return NextResponse.json(responseMessage(null, "参数 text 长度不能超过 2000 个字符", RESPONSE.ERROR));
    }

    const allowedFormats = ["png", "svg", "dataurl"];
    if (!allowedFormats.includes(format)) {
      return NextResponse.json(responseMessage(null, `参数 format 必须是 ${allowedFormats.join(", ")}`, RESPONSE.ERROR));
    }

    if (isNaN(size) || size < 64 || size > 1000) {
      return NextResponse.json(responseMessage(null, '参数 size 必须在 64 ~ 1000 之间', RESPONSE.ERROR));
    }

    // SVG
    if (format === "svg") {
      const svg = await QRCode.toString(text, {
        type: "svg",
        width: size,
      });

      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
        },
      });
    }

    // DataURL
    if (format === "dataurl") {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
      });

      return NextResponse.json(responseMessage(dataUrl));
    }

    // PNG (默认)
    const buffer = await QRCode.toBuffer(text, {
      width: size,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}