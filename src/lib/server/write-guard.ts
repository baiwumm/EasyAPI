import type { ApiSaveParams, CategorySaveParams } from "@/typings";

import { REQUEST_METHODS } from "@/enums";
import { pickFields } from "@/lib/utils";

/**
 * @description: 管理端写接口请求体解析
 * 按白名单过滤字段（防止 id / call_count / created_at 等任意列透传），
 * 新增模式额外校验必填项，两种模式都按字段规则校验取值范围（与前端表单一致）
 */

/** ea_apis 可写字段白名单（与前端保存表单一致） */
const API_FIELDS = [
  "category_id",
  "name",
  "desc",
  "path",
  "method",
  "pinned",
  "is_featured",
  "operation_id",
  "sort",
] as const;

/** ea_categorys 可写字段白名单 */
const CATEGORY_FIELDS = ["name", "desc", "sort"] as const;

/** 字段规则：边界与前端 save-modal 的 maxLength / minValue 保持一致 */
type FieldRule =
  | { type: "text"; min?: number; max: number; prefix?: string }
  | { type: "sort" }
  | { type: "boolean" }
  | { type: "enum"; values: readonly string[] };

const API_FIELD_RULES: Record<(typeof API_FIELDS)[number], FieldRule> = {
  // category_id 是 uuid
  category_id: { type: "text", min: 1, max: 64 },
  name: { type: "text", min: 1, max: 100 },
  desc: { type: "text", max: 200 },
  path: { type: "text", min: 1, max: 100, prefix: "/" },
  operation_id: { type: "text", min: 1, max: 100 },
  method: { type: "enum", values: REQUEST_METHODS.values },
  sort: { type: "sort" },
  pinned: { type: "boolean" },
  is_featured: { type: "boolean" },
};

const CATEGORY_FIELD_RULES: Record<(typeof CATEGORY_FIELDS)[number], FieldRule> =
  {
    name: { type: "text", min: 1, max: 100 },
    desc: { type: "text", max: 200 },
    sort: { type: "sort" },
  };

interface ParseResult<T> {
  payload?: T;
  error?: string;
}

/**
 * @description: 逐字段校验取值范围
 * 直接调 API 时没有前端兜底，写错字段会把 PostgREST 的原始错误透出去，
 * 所以这里按规则提前拦住并返回人能看懂的错误
 */
function validateFields(
  payload: Record<string, unknown>,
  rules: Record<string, FieldRule>,
): string | undefined {
  for (const key of Object.keys(rules)) {
    // 只校验本次提交里出现的字段（update 允许部分字段）
    if (!(key in payload)) {
      continue;
    }

    const value = payload[key];
    const rule = rules[key];

    if (rule.type === "sort") {
      // 前端是 1 ~ 99 的 NumberField，直接调 API 却可以写 sort:-999，
      // 排序立刻被打乱且页面上看不出原因
      if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 1 ||
        value > 99
      ) {
        return `参数 sort 必须是 1 ~ 99 的整数，收到 ${JSON.stringify(value)}`;
      }
    } else if (rule.type === "boolean") {
      if (typeof value !== "boolean") {
        return `参数 ${key} 必须是布尔值`;
      }
    } else if (rule.type === "enum") {
      if (!rule.values.includes(value as never)) {
        return `参数 ${key} 不合法`;
      }
    } else if (typeof value !== "string") {
      return `参数 ${key} 必须是字符串`;
    } else if (rule.min !== undefined && value.length < rule.min) {
      return `参数 ${key} 长度不能少于 ${rule.min} 个字符`;
    } else if (value.length > rule.max) {
      return `参数 ${key} 长度不能超过 ${rule.max} 个字符`;
    } else if (rule.prefix && !value.startsWith(rule.prefix)) {
      return `参数 ${key} 必须以 ${rule.prefix} 开头`;
    }
  }

  return undefined;
}

export function parseApiBody(
  body: unknown,
  mode: "create" | "update",
): ParseResult<Partial<ApiSaveParams>> {
  if (typeof body !== "object" || body === null) {
    return { error: "请求体格式错误" };
  }

  const payload = pickFields(body, API_FIELDS) as Partial<ApiSaveParams>;

  // update({}) 会通过白名单，然后让 PostgREST 报一条看不懂的错，
  // 且调用方无法区分「改了什么」——直接拦在写库之前
  if (mode === "update" && Object.keys(payload).length === 0) {
    return { error: "没有需要更新的字段" };
  }

  if (mode === "create") {
    for (const key of ["category_id", "name", "path", "method"] as const) {
      if (!payload[key]) {
        return { error: `参数 ${key} 必填` };
      }
    }
  }

  const fieldError = validateFields(payload, API_FIELD_RULES);

  if (fieldError) {
    return { error: fieldError };
  }

  return { payload };
}

export function parseCategoryBody(
  body: unknown,
  mode: "create" | "update",
): ParseResult<Partial<CategorySaveParams>> {
  if (typeof body !== "object" || body === null) {
    return { error: "请求体格式错误" };
  }

  const payload = pickFields(
    body,
    CATEGORY_FIELDS,
  ) as Partial<CategorySaveParams>;

  if (mode === "update" && Object.keys(payload).length === 0) {
    return { error: "没有需要更新的字段" };
  }

  if (mode === "create" && !payload.name) {
    return { error: "参数 name 必填" };
  }

  const fieldError = validateFields(payload, CATEGORY_FIELD_RULES);

  if (fieldError) {
    return { error: fieldError };
  }

  return { payload };
}
