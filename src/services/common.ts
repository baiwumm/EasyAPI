import { httpRequest } from '@/lib/request'

import type { IResponse } from '@/typings'

/**
 * @description: 获取接口数据
 */
export function getApiData(path: string, params?: Record<string, any>) {
  return httpRequest.get<IResponse>(path, params)
}
