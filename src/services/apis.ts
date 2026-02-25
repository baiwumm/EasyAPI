/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 16:51:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-25 14:29:15
 * @Description: 接口列表模块
 */
import { httpRequest } from '@/lib/request';

const BASE_URL = '/apis';

/**
 * @description: 获取接口列表
 */
export const getApisList = (params: App.ApiQueryParams) => {
  return httpRequest.get<App.PaginatingResponse<App.Api>>(BASE_URL, params);
};

/**
 * @description: 新增接口
 */
export const addApi = (params: App.ApiSaveParams) => {
  return httpRequest.post<App.Api>(BASE_URL, params);
};

/**
 * @description: 更新接口
 */
export const updateApi = ({ id, ...params }: App.ApiSaveParams) => {
  return httpRequest.put<App.Api>(`${BASE_URL}/${id}`, params);
};

/**
 * @description: 删除接口
 */
export const delApi = (id: string) => {
  return httpRequest.delete<App.Api>(`${BASE_URL}/${id}`);
};