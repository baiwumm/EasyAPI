/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 17:33:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-13 17:56:26
 * @Description:
 */
// 直接导入独立子包，绕开 @dicebear/collection 的巨型 barrel（会解析全部 30+ 风格）；
// namespace 导入与 collection 内部一致，提供 create/meta/schema，满足 Style 类型
import type { Style } from "@dicebear/core";
import type { NextRequest } from "next/server";

import * as adventurer from "@dicebear/adventurer";
import * as avataaars from "@dicebear/avataaars";
import * as bottts from "@dicebear/bottts";
import { createAvatar } from "@dicebear/core";
import * as funEmoji from "@dicebear/fun-emoji";
import * as lorelei from "@dicebear/lorelei";
import * as micah from "@dicebear/micah";
import * as notionists from "@dicebear/notionists";
import * as openPeeps from "@dicebear/open-peeps";
import * as personas from "@dicebear/personas";
import * as pixelArt from "@dicebear/pixel-art";
import * as thumbs from "@dicebear/thumbs";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

import { AVATAR_STYLES } from "@/enums";
import {
  getCachedAvatarSvg,
  setCachedAvatarSvg,
} from "@/lib/server/avatar-cache";
import { catchError, parseBoundedInt, responseMessage } from "@/lib/utils";

/**
 * style -> dicebear style
 */
const STYLE_MAP: Record<string, Style<any>> = {
  adventurer,
  avataaars,
  bottts,
  pixelArt,
  funEmoji,
  lorelei,
  micah,
  notionists,
  openPeeps,
  personas,
  thumbs,
};

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const params = request.nextUrl.searchParams;

    /**
     * 参数
     */
    const styleParam = (params.get("style") ||
      AVATAR_STYLES.ADVENTURER) as (typeof AVATAR_STYLES.values)[number];
    const seedParam = params.get("seed");

    /**
     * 参数限制
     * 用 parseBoundedInt 而非 clamp(parseInt())：后者遇到非数字会得到 NaN，
     * 一路传给 createAvatar 产出 width="NaN" 的坏 SVG
     * 上限 50 与页面「生成的数量」控件的 maxValue 一致
     */
    const count = parseBoundedInt(params.get("count"), 1, 1, 50);
    const size = parseBoundedInt(params.get("size"), 128, 16, 512);

    /**
     * style 校验：random 在生成时逐个解析成具体风格（resolveStyle），
     * 这里只确认入参合法，非 random 时 styleValue 就是最终风格
     */
    const styleValue = AVATAR_STYLES.values.includes(styleParam)
      ? styleParam
      : AVATAR_STYLES.ADVENTURER;

    /**
     * 多个头像 → 返回 data URI 数组（format=data）或 URL 数组
     * 只返 URL 的话，浏览器拿到还要逐个请求，每个都再过一次中间件的计数查询，
     * 50 个头像就是 50 次数据库往返，等于没省（F6）
     */
    if (count > 1) {
      const baseUrl = request.nextUrl.origin;

      const list = Array.from({ length: count }, () => {
        const seed = faker.string.uuid();
        // random 风格要逐个头像各自随机，否则整批会长一个样
        const itemStyle = resolveStyle(styleValue);

        return {
          url: `${baseUrl}/api/random-avatar?seed=${seed}&size=${size}&style=${itemStyle}`,
          data: toSvgDataUri(renderAvatarSvg(itemStyle, seed, size)),
        };
      });

      return NextResponse.json(
        responseMessage(
          (params.get("format") === "data"
            ? list.map((item) => item.data)
            : list.map((item) => item.url)) as string[],
        ),
      );
    }

    /**
     * 单个头像
     * SVG 对同一组 seed+style+size 是确定性的，命中缓存就不必再跑一遍 dicebear（F3）
     */
    const seed = seedParam || crypto.randomUUID();

    const svg = renderAvatarSvg(styleValue, seed, size);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    return NextResponse.json(catchError(err));
  }
}

/**
 * @description: random 风格时随机挑一个具体风格；已指定风格则原样返回
 */
function resolveStyle(styleValue: string): string {
  if (styleValue !== AVATAR_STYLES.RANDOM) {
    return styleValue;
  }

  return faker.helpers.arrayElement(Object.keys(STYLE_MAP));
}

/**
 * @description: 生成单个头像 SVG（带 LRU 缓存，F3）
 */
function renderAvatarSvg(styleValue: string, seed: string, size: number) {
  const cacheKey = `${styleValue}:${size}:${seed}`;
  const cached = getCachedAvatarSvg(cacheKey);

  if (cached !== undefined) {
    return cached;
  }

  const svg = createAvatar(STYLE_MAP[styleValue], {
    seed,
    size,
  }).toString();

  setCachedAvatarSvg(cacheKey, svg);

  return svg;
}

/**
 * @description: SVG 文本转 data URI，供 <img> 直接展示
 */
function toSvgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
