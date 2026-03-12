/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-12 09:22:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-12 14:29:57
 * @Description: 生成条形码
 */
import JsBarcode, { type Options } from "jsbarcode";
import { NextRequest, NextResponse } from 'next/server'
import sharp from "sharp";
import { DOMImplementation, XMLSerializer } from "xmldom";

import { BARCODE_FORMATS, BARCODE_TYPES, RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

type BarcodeFormat = typeof BARCODE_FORMATS.keys[number];

function isValidFormat(format: string): format is BarcodeFormat {
  return BARCODE_FORMATS.keys.includes(format as BarcodeFormat);
}

function validateText(format: string, text: string) {
  const rule = BARCODE_FORMATS.raw(format);

  if (!rule) return null;

  if (!rule.regex.test(text)) {
    return rule.message;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const { searchParams } = request.nextUrl;

    const { text, format, type, ...rest } = Object.fromEntries(searchParams);

    // 参数校验
    if (!text) {
      return NextResponse.json(responseMessage(null, '缺少 text 参数', RESPONSE.ERROR));
    }

    if (!isValidFormat(format)) {
      return NextResponse.json(responseMessage(null, `format 格式错误，只支持${BARCODE_FORMATS.labels.join('、')}`, RESPONSE.ERROR));
    }

    const error = validateText(format, text);

    if (error) {
      return NextResponse.json(responseMessage(null, error, RESPONSE.ERROR));
    }

    // 创建 SVG DOM
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const extraOptions = Object.fromEntries(
      Object.entries(rest).map(([k, v]) => [
        k,
        isNaN(Number(v)) ? v : Number(v)
      ])
    );

    const options: Options = {
      format,
      ...extraOptions,
      xmlDocument: document
    };

    JsBarcode(svgNode, text, options);

    const svg = new XMLSerializer().serializeToString(svgNode);

    // SVG
    if (type === BARCODE_TYPES.SVG) {
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
        }
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
        }
      });
    }

    return NextResponse.json(responseMessage(null, `type 格式错误，支持 ${BARCODE_TYPES.labels.join('、')}`, RESPONSE.ERROR));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, RESPONSE.ERROR));
  }
}