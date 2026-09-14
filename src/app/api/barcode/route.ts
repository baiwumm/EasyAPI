/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-12 09:22:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 16:09:45
 * @Description: 生成条形码
 */
import type { Options } from "jsbarcode";
import type { NextRequest } from "next/server";

import { Buffer } from "node:buffer";

import JsBarcode from "jsbarcode";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { DOMImplementation, XMLSerializer } from "xmldom";

import { BARCODE_FORMATS, BARCODE_TYPES, RESPONSE } from "@/enums";
import { catchError, clamp, responseMessage } from "@/lib/utils";

type BarcodeFormat = (typeof BARCODE_FORMATS.keys)[number];

// 防滥用限制：条形码实际编码容量有限，且 JsBarcode/sharp 的尺寸参数无界会放大内存占用
const MAX_TEXT_LENGTH = 200;
const MAX_OPTION_VALUE = 500;

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = request.nextUrl;

    const { text, format, type, ...rest } = Object.fromEntries(searchParams);

    // 参数校验
    if (!text) {
      return NextResponse.json(
        responseMessage(null, "缺少 text 参数", RESPONSE.ERROR),
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        responseMessage(
          null,
          `参数 text 长度不能超过 ${MAX_TEXT_LENGTH} 个字符`,
          RESPONSE.ERROR,
        ),
      );
    }

    if (!isValidFormat(format)) {
      return NextResponse.json(
        responseMessage(
          null,
          `format 格式错误，只支持${BARCODE_FORMATS.labels.join("、")}`,
          RESPONSE.ERROR,
        ),
      );
    }

    if (type !== BARCODE_TYPES.SVG && type !== BARCODE_TYPES.PNG) {
      return NextResponse.json(
        responseMessage(
          null,
          `type 格式错误，支持 ${BARCODE_TYPES.labels.join("、")}`,
          RESPONSE.ERROR,
        ),
      );
    }

    // 创建 SVG DOM
    const document = new DOMImplementation().createDocument(
      "http://www.w3.org/1999/xhtml",
      "html",
      null,
    );
    const svgNode = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    // 任意查询参数转数字后直传 JsBarcode，统一钳制在 0 ~ 500
    const extraOptions = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => {
        const n = Number(v);

        return [k, Number.isNaN(n) ? v : clamp(n, 0, MAX_OPTION_VALUE)];
      }),
    );

    const options: Options = {
      format,
      ...extraOptions,
      xmlDocument: document,
    };

    JsBarcode(svgNode, text, options);

    const svg = new XMLSerializer().serializeToString(svgNode);

    // SVG
    if (type === BARCODE_TYPES.SVG) {
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
        },
      });
    }

    // PNG
    if (type === BARCODE_TYPES.PNG) {
      const pngBuffer = await sharp(Buffer.from(svg), { density: 300 })
        .png()
        .toBuffer();

      return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
          "Content-Type": "image/png",
        },
      });
    }

    return NextResponse.json(
      responseMessage(
        null,
        `type 格式错误，支持 ${BARCODE_TYPES.labels.join("、")}`,
        RESPONSE.ERROR,
      ),
    );
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}

function isValidFormat(format: string): format is BarcodeFormat {
  return BARCODE_FORMATS.keys.includes(format as BarcodeFormat);
}
