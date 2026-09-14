import type { IResponse } from "@/typings";

import dayjs from "dayjs";

import { RESPONSE } from "@/enums";

/**
 * @description: 统一返回体
 */
export function responseMessage(
  data: unknown,
  msg: string = RESPONSE.label(RESPONSE.SUCCESS),
  code: number = RESPONSE.SUCCESS,
): IResponse {
  return { data, msg, code, timestamp: dayjs().valueOf() };
}

/**
 * @description: 判断请求是否成功
 */
export const isSuccess = (code?: number): boolean => code === RESPONSE.SUCCESS;

/**
 * @description: 清理模糊搜索关键字
 * - 转义 LIKE 通配符（% _ \），防止通配符注入导致全表扫描
 * - 移除 PostgREST or() 过滤器语法字符（, ( ) "），防止用户输入改变过滤语义
 */
export function sanitizeLikeKeyword(keyword: string): string {
  return keyword.replace(/[,()"\\]/g, "").replace(/([%_])/g, "\\$1");
}

/**
 * @description: 按白名单过滤对象字段（管理端写接口防任意列透传）
 */
export function pickFields(
  body: unknown,
  allowed: readonly string[],
): Record<string, unknown> {
  if (typeof body !== "object" || body === null) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).filter(([key]) =>
      (allowed as readonly string[]).includes(key),
    ),
  );
}

/**
 * @description: 统一处理 catch 错误
 */
export function catchError(err: unknown): IResponse {
  let message = "未知错误";

  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }

  return responseMessage(null, message, RESPONSE.ERROR);
}

/**
 * Dynamically get a nested value from an array or
 * object with a string.
 *
 * @example get(person, 'friends[0].name')
 */
export function get<TDefault = unknown>(
  value: unknown,
  path: string,
  defaultValue?: TDefault,
): TDefault {
  const segments = path.split(/[.[\]]/g);
  let current: any = value;

  for (const key of segments) {
    if (current === null) return defaultValue as TDefault;
    if (current === undefined) return defaultValue as TDefault;
    const dequoted = key.replace(/['"]/g, "");

    if (dequoted.trim() === "") continue;
    current = current[dequoted];
  }
  if (current === undefined) return defaultValue as TDefault;

  return current;
}

/**
 * Pick a list of properties from an object
 * into a new object
 */
export function pick<T extends object, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[],
): Pick<T, TKeys> {
  if (!obj) return {} as Pick<T, TKeys>;

  return keys.reduce(
    (acc, key) => {
      if (Object.hasOwn(obj, key)) acc[key] = obj[key];

      return acc;
    },
    {} as Pick<T, TKeys>,
  );
}

/**
 * @description: 限制值范围
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const clamp = (
  value: number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER,
): number => Math.min(Math.max(value, min), max);

/**
 * @description: 解析查询参数为整数并钳制范围
 * 非数字/NaN 时返回 fallback，而不是让 NaN 在 clamp 中短路成空结果
 */
export function parseBoundedInt(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const n = parseInt(value ?? "", 10);

  if (Number.isNaN(n)) {
    return fallback;
  }

  return Math.min(Math.max(n, min), max);
}

/**
 * @description: 生成倒序年份选项（当前年 → startYear），供 holiday/solar-term 等下拉使用
 */
export function buildYearOptions(startYear: number, currentYear?: number) {
  const endYear = currentYear ?? dayjs().year();

  return Array.from(
    { length: Math.max(endYear - startYear + 1, 0) },
    (_, i) => {
      const year = endYear - i;

      return { value: year, label: `${year}年` };
    },
  );
}

/**
 * 解析 bind 每日图片
 */

// https://cn.bing.com//th?id=OHR.GipuzcoaSummer_ZH-CN1926924422_UHD.jpg
// https://cn.bing.com/th?id=OHR.GipuzcoaSummer_ZH-CN1926924422_1920x1080.jpg
export function get4kUrl(url: string) {
  const id = (new URL(url).searchParams.get("id") || "").replace(
    /_\d+x\d+\.jpg$/,
    "",
  );

  return `https://bing.com/th?id=${id}_UHD.jpg`;
}
export function getUrl(url: string) {
  const id = (new URL(url).searchParams.get("id") || "").replace(
    /_\d+x\d+\.jpg$/,
    "",
  );

  return `https://bing.com/th?id=${id}_1920x1080.jpg`;
}
