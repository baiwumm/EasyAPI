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
import { DOMImplementation, XMLSerializer } from "@xmldom/xmldom";

import { BARCODE_FORMATS, BARCODE_TYPES, RESPONSE } from "@/enums";
import { catchError, clamp, responseMessage } from "@/lib/utils";

type BarcodeFormat = (typeof BARCODE_FORMATS.keys)[number];

// 防滥用限制：条形码实际编码容量有限，且 JsBarcode/sharp 的尺寸参数无界会放大内存占用
const MAX_TEXT_LENGTH = 200;
const MAX_OPTION_VALUE = 500;
// PNG 栅格化后的单边上限（像素）。条码再大也不影响可扫，
// 但没有这个上限时一个请求就能让 sharp 尝试分配几十亿像素的位图
const MAX_RASTER_SIDE = 4096;
// sharp 按 density 300 渲染 SVG，而 SVG 自身默认按 96 DPI 计算尺寸
const RASTER_SCALE = 300 / 96;

// JsBarcode 选项白名单（C10）：只放行下列已在文档登记的键及其取值形态，
// 未登记的查询参数一律丢弃，不透传给 JsBarcode
// 键集合对齐 jsbarcode 的 BaseOptions，去掉由本路由单独校验的 format/text
// 与只能在服务端使用的回调 valid
type BarcodeOptionRule =
  | { type: "number"; max: number }
  | { type: "boolean" }
  | { type: "color" }
  | { type: "enum"; values: readonly string[] }
  | { type: "text"; maxLength: number };

const BARCODE_OPTION_RULES: Record<string, BarcodeOptionRule> = {
  width: { type: "number", max: MAX_OPTION_VALUE },
  height: { type: "number", max: MAX_OPTION_VALUE },
  margin: { type: "number", max: MAX_OPTION_VALUE },
  marginTop: { type: "number", max: MAX_OPTION_VALUE },
  marginBottom: { type: "number", max: MAX_OPTION_VALUE },
  marginLeft: { type: "number", max: MAX_OPTION_VALUE },
  marginRight: { type: "number", max: MAX_OPTION_VALUE },
  textMargin: { type: "number", max: MAX_OPTION_VALUE },
  fontSize: { type: "number", max: MAX_OPTION_VALUE },
  displayValue: { type: "boolean" },
  flat: { type: "boolean" },
  lineColor: { type: "color" },
  background: { type: "color" },
  font: { type: "text", maxLength: 64 },
  fontOptions: {
    type: "enum",
    values: ["bold", "italic", "bold italic", "italic bold"],
  },
  textAlign: { type: "enum", values: ["left", "center", "right"] },
  textPosition: { type: "enum", values: ["top", "bottom"] },
};

// 颜色写法收窄为十六进制与少量关键字：取值最终写进 SVG 的 stroke / fill，
// 收窄格式既避免渲染端拿到垃圾值，也让文档能如实描述
const COLOR_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const NAMED_COLORS: readonly string[] = [
  "transparent",
  "currentcolor",
  "black",
  "white",
];

const isSafeColor = (value: string): boolean =>
  COLOR_PATTERN.test(value) || NAMED_COLORS.includes(value.toLowerCase());

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

    // 额外选项按白名单逐个解析后再传给 JsBarcode
    const extraOptions = parseBarcodeOptions(rest);

    const options: Options = {
      format,
      ...extraOptions,
      // @xmldom/xmldom 的 Document 与 lib.dom 的 XMLDocument 类型不同源，运行时结构兼容
      xmlDocument: document as unknown as XMLDocument,
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

    // PNG 栅格化前先看 SVG 声明尺寸：text 最长 200 字符、width 又顶到 500 时，
    // 声明宽度会有几十万，sharp 会抛 "Input image exceeds pixel limit" 这种内部原文
    // （运气好撞上限，运气不好就是一次巨量内存分配），提前拦掉并给出可读文案（F5）
    const oversizeError = checkSvgOversize(svgNode);

    if (oversizeError) {
      return NextResponse.json(
        responseMessage(null, oversizeError, RESPONSE.ERROR),
      );
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

/**
 * @description: 校验 SVG 声明尺寸换算成栅格像素后没超上限
 * 只依赖 getAttribute，不耦合 @xmldom/xmldom 的具体类型
 */
function checkSvgOversize(svgNode: {
  getAttribute: (name: string) => string | null;
}): string | undefined {
  // JsBarcode 写出来的属性带单位，形如 "288px"，用 parseFloat 而不是 Number
  const width = Number.parseFloat(svgNode.getAttribute("width") ?? "");
  const height = Number.parseFloat(svgNode.getAttribute("height") ?? "");
  const maxSvgSide = MAX_RASTER_SIDE / RASTER_SCALE;

  if (
    width > maxSvgSide ||
    height > maxSvgSide ||
    (svgNode.getAttribute("width") !== null && !Number.isFinite(width)) ||
    (svgNode.getAttribute("height") !== null && !Number.isFinite(height))
  ) {
    return `条码尺寸过大，请调小 width / height（上限约 ${Math.floor(maxSvgSide)}）`;
  }

  return undefined;
}

/**
 * @description: 按白名单解析 JsBarcode 额外选项（C10）
 * 只放行 BARCODE_OPTION_RULES 登记过的键，取值还要符合登记的类型；
 * 未登记的键、空值一律丢弃，不再像之前那样把 rest 原样透传
 */
function parseBarcodeOptions(
  rest: Record<string, string>,
): Record<string, string | number | boolean> {
  const options: Record<string, string | number | boolean> = {};

  for (const [key, raw] of Object.entries(rest)) {
    const rule = BARCODE_OPTION_RULES[key];

    if (!rule || raw === "") {
      continue;
    }

    if (rule.type === "number") {
      const n = Number(raw);

      // 非数字直接丢弃，让该选项走 JsBarcode 默认值，
      // 而不是把 width=abc 这样的字符串塞进绘图参数
      if (Number.isFinite(n)) {
        options[key] = clamp(n, 0, rule.max);
      }
    } else if (rule.type === "boolean") {
      // "false"/"0" 字符串本身就是真值，直接透传会让 displayValue=false
      // 变成「显示」，必须显式转换成布尔
      options[key] = raw === "true" || raw === "1";
    } else if (rule.type === "enum") {
      if (rule.values.includes(raw)) {
        options[key] = raw;
      }
    } else if (rule.type === "color") {
      if (isSafeColor(raw)) {
        options[key] = raw;
      }
    } else if (raw.length <= rule.maxLength) {
      options[key] = raw;
    }
  }

  return options;
}
