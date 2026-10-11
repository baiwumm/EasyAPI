import type { IResponse } from "@/typings";

import { httpRequest } from "@/lib/request";

/**
 * @description: 获取接口数据
 */
export function getApiData(path: string, params?: Record<string, any>) {
  return httpRequest.get<IResponse>(path, params);
}

/**
 * @description: 提交接口数据（POST + JSON body）
 * 敏感参数（如密码）不能用 getApiData：会拼进 URL query string 并落进访问日志
 */
export function postApiData(path: string, data: Record<string, any>) {
  return httpRequest.post<IResponse>(path, data);
}
