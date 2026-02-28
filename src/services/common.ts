import { httpRequest } from '@/lib/request';

/**
 * @description: 获取接口数据
 */
export const getApiData = (path: string, params?: Record<string, string>) => {
  return httpRequest.get<App.IResponse>(path, params);
};