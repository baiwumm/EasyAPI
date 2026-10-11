/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Description: Fetch 请求封装（替代 axios，保持 httpRequest 签名与拦截器行为不变）
 */
import type { IResponse } from "@/typings";

import { CircleXmarkFill } from "@gravity-ui/icons";
import { toast } from "@heroui/react";
import { createElement } from "react";

import { RESPONSE } from "@/enums";
import { isSuccess } from "@/lib/utils";

type ApiResponse<T = unknown> = IResponse<T>;

interface HttpRequestConfig {
  /** 查询参数（GET 拼接到 URL） */
  params?: object;
  /** 配置 skipErrorHandler 会跳过默认的错误处理，用于项目中部分特殊的接口 */
  skipErrorHandler?: boolean;
  /** 请求超时时间(ms)，默认 30s */
  timeout?: number;
  /** 自定义请求头 */
  headers?: HeadersInit;
}

const BASE_URL = "/api";
const DEFAULT_TIMEOUT = 30 * 1000; // 请求超时时间,默认30秒

/**
 * @description: 拼接请求地址与查询参数
 */
function buildUrl(url: string, params?: object) {
  if (!params) {
    return `${BASE_URL}${url}`;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `${BASE_URL}${url}?${query}` : `${BASE_URL}${url}`;
}

/**
 * @description: 发起请求并做统一拦截（超时、401 会话过期），返回原始 Response
 * 不做响应体解析，业务错误码提示也不在这里，交给调用方按需处理——
 * 图片/文本直出接口（SVG、PNG）拿不到 JSON，自己解 body
 */
async function sendRequest(
  url: string,
  method: string,
  data?: unknown,
  config?: HttpRequestConfig,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    config?.timeout ?? DEFAULT_TIMEOUT,
  );

  try {
    const headers = new Headers(config?.headers);
    let body: BodyInit | undefined;

    if (data !== undefined && data !== null) {
      if (data instanceof FormData) {
        body = data;
      } else {
        body = JSON.stringify(data);
        headers.set("Content-Type", "application/json");
      }
    }

    const response = await fetch(buildUrl(url, config?.params), {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    // 会话过期：统一提示并跳转登录页（否则后台写操作静默失败，用户误以为提交成功）
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      toast.danger("登录已过期，请重新登录", {
        indicator: createElement(CircleXmarkFill),
        timeout: 3000,
      });
      window.location.assign("/login?expired=1");
    }

    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @description: 统一请求处理
 * 业务错误码统一 toast 提示并正常返回，由组件自行判断；
 * 网络错误/HTTP 错误码直接抛出，交给组件层的 error 状态处理
 */
async function request<T>(
  url: string,
  method: string,
  data?: unknown,
  config?: HttpRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await sendRequest(url, method, data, config);

  // 网络错误，直接抛出
  if (!response.ok) {
    throw new Error(`请求失败 ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<T>;

  // 业务错误码统一提示（配置 skipErrorHandler 跳过）
  if (!isSuccess(result.code) && !config?.skipErrorHandler) {
    toast.danger(result.msg || RESPONSE.label(RESPONSE.ERROR), {
      indicator: createElement(CircleXmarkFill),
      timeout: 3000,
    });
  }

  return result;
}

/**
 * @description: 导出封装的请求方法
 */
export const httpRequest = {
  get<T = unknown>(
    url: string,
    params?: object,
    config?: HttpRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request<T>(url, "GET", undefined, { ...config, params });
  },

  post<T = unknown>(
    url: string,
    data?: object,
    config?: HttpRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request<T>(url, "POST", data, config);
  },

  put<T = unknown>(
    url: string,
    data?: object,
    config?: HttpRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request<T>(url, "PUT", data, config);
  },

  delete<T = unknown>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<ApiResponse<T>> {
    return request<T>(url, "DELETE", undefined, config);
  },

  /**
   * 原始响应：图片/SVG 直出接口用。
   * 与各业务方法共用超时与 401 处理，但不解 JSON、不弹业务错误，
   * 响应体由调用方按 content-type 自己读
   */
  raw(url: string, params?: object, config?: HttpRequestConfig): Promise<Response> {
    return sendRequest(url, "GET", undefined, { ...config, params });
  },
};
