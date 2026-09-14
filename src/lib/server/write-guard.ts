import type { ApiSaveParams, CategorySaveParams } from "@/typings";

import { REQUEST_METHODS } from "@/enums";
import { pickFields } from "@/lib/utils";

/**
 * @description: 管理端写接口请求体解析
 * 按白名单过滤字段（防止 id / call_count / created_at 等任意列透传），
 * 新增模式额外校验必填项与枚举取值
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

interface ParseResult<T> {
  payload?: T;
  error?: string;
}

export function parseApiBody(
  body: unknown,
  mode: "create" | "update",
): ParseResult<Partial<ApiSaveParams>> {
  if (typeof body !== "object" || body === null) {
    return { error: "请求体格式错误" };
  }

  const payload = pickFields(body, API_FIELDS) as Partial<ApiSaveParams>;

  if (mode === "create") {
    for (const key of ["category_id", "name", "path", "method"] as const) {
      if (!payload[key]) {
        return { error: `参数 ${key} 必填` };
      }
    }

    if (!REQUEST_METHODS.values.includes(payload.method as never)) {
      return { error: "参数 method 不合法" };
    }
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

  if (mode === "create" && !payload.name) {
    return { error: "参数 name 必填" };
  }

  return { payload };
}
