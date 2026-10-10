import type { SupabaseClient } from "@supabase/supabase-js";

import { NextResponse } from "next/server";

import { RESPONSE } from "@/enums";
import { pick, responseMessage, sanitizeLikeKeyword } from "@/lib/utils";

type Supabase = SupabaseClient<any, "public", any>;

/** 文本直出响应（format=text） */
export function textResponse(content: string): NextResponse {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

/**
 * 公开接口的统一错误响应：原始错误只进服务端日志，对外返回固定文案。
 *
 * 直接回传 `error.message` 会把 PostgREST 的内部细节透给匿名调用方
 * （如 `relation "ea_license_plate" does not exist`、列名、权限信息），
 * 既泄露 schema 又给攻击者省了踩点成本。仅管理端路由可保留原文，
 * 那边调用方已通过 requireAdmin 鉴权、需要原文排查。
 */
export function dbErrorResponse(
  error: { message?: string } | null,
  label: string,
): NextResponse {
  // 服务端运维日志（公开接口无上报通道），定向豁免 no-console
  // eslint-disable-next-line no-console
  console.error(`[${label}]`, error?.message ?? error);

  return NextResponse.json(
    responseMessage(null, "服务开小差，请稍后重试", RESPONSE.ERROR),
  );
}

interface RandomTextOptions {
  /** RPC 额外参数（如 hitokoto 的筛选） */
  params?: Record<string, unknown>;
  /** JSON 输出字段（默认仅 content） */
  fields?: string[];
}

/**
 * 文案类接口统一处理（batch-3 模板）：
 * RPC 取随机文案 → format=text 直出文本 → JSON 只输出白名单字段
 */
export async function randomTextResponse(
  supabase: Supabase,
  rpcName: string,
  format: string | null,
  { params, fields = ["content"] }: RandomTextOptions = {},
): Promise<NextResponse> {
  const { data, error } = await supabase.rpc(rpcName, params);

  // 执行失败
  if (error) {
    return dbErrorResponse(error, rpcName);
  }

  // 数据为空（表空/RPC 无返回）时 text 分支会崩，统一返回业务错误。
  // 判据用 typeof 而非 !data?.content：content 为空字符串是合法数据，
  // 不应被当成"暂无数据"报 500
  if (!data || typeof data.content !== "string") {
    return NextResponse.json(responseMessage(null, "暂无数据", RESPONSE.ERROR));
  }

  // 返回 text 格式
  if (format === "text") {
    return textResponse(data.content);
  }

  return NextResponse.json(responseMessage(pick(data, fields)));
}

/**
 * 构造 PostgREST or() 多列 ilike 过滤串
 * 关键字经 sanitizeLikeKeyword 净化，防止过滤器注入
 */
export function ilikeOr(keyword: string, columns: string[]): string {
  const kw = sanitizeLikeKeyword(keyword);

  return columns.map((column) => `${column}.ilike.%${kw}%`).join(",");
}
