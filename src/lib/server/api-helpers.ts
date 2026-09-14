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
    return NextResponse.json(
      responseMessage(null, error.message, RESPONSE.ERROR),
    );
  }

  // 数据为空（表空/RPC 无返回）时 text 分支会崩，统一返回业务错误
  if (!data?.content) {
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
