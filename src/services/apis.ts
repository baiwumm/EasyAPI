/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:51:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-25 14:29:15
 * @Description: 接口列表模块
 */
import type {
  Api,
  ApiQueryParams,
  ApiSaveParams,
  PaginatingResponse,
} from "@/typings";

import { httpRequest } from "@/lib/request";

const BASE_URL = "/apis";

/**
 * @description: 新增接口
 */
export function addApi(params: ApiSaveParams) {
  return httpRequest.post<Api>(BASE_URL, params);
}

/**
 * @description: 删除接口
 */
export function delApi(id: string) {
  return httpRequest.delete<Api>(`${BASE_URL}/${id}`);
}

/**
 * @description: 获取接口列表
 */
export function getApisList(params: ApiQueryParams) {
  return httpRequest.get<PaginatingResponse<Api>>(BASE_URL, params);
}

/**
 * @description: 更新接口
 */
export function updateApi({ id, ...params }: ApiSaveParams) {
  return httpRequest.put<Api>(`${BASE_URL}/${id}`, params);
}
