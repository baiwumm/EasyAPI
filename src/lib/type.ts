/**
 * @description: 分类类型定义
 */
export type Category = {
  id: string; // 唯一 id
  name: string; // 分类名称
  desc?: string; // 分类描述
  created_at: string; // 创建时间
}

/**
 * @description: 接口类型定义
 */
export type Api = {
  id: string; // 唯一 id
  name: string; // 接口名称
  desc?: string; // 接口描述
  path: string; // 接口路径
  method: string; // 请求方式
  request_params: Record<string, string> | null; // 请求参数
  response_format: Record<string, string> | null; // 响应格式
  is_featured: boolean; // 是否推荐
  category_id: string; // 分类 id
  call_count: number; // 调用次数
  last_called: string | null; // 最后调用时间
  created_at: string; // 创建时间
}