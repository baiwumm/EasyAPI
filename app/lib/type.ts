import type { RESPONSE_STATUS_CODE, REQUEST_METHOD } from '~/lib/enum'

/**
 * @description: 响应体结构
 */
export type Response<T = any> = {
  code: RESPONSE_STATUS_CODE // 状态码
  msg: string // 状态信息
  data?: T // 数据
}

/**
 * @description: 分页列表
 */
export type PageResponse<T = any> = {
  list: T[]
  total: number | null // 总页数
}

/**
 * @description: 分页参数
 */
export type PaginationParams = {
  current: number // 当前页
  pageSize: number // 每页条数
}

/**
 * @description: 接口列表
 */
export type ApiList = {
  id: string; // uuid
  category_id: string; // 所属分类
  name: string; // 接口名称
  desc?: string; // 接口描述
  path: string; // 接口 url
  method: REQUEST_METHOD; // 请求方式
  pinned: boolean; // 是否置顶
  is_featured: boolean; // 是否推荐
  call_count: number; // 调用次数
  last_called: Date; // 最后调用时间
  sort: number // 排序
  created_at: Date // 创建时间
  updated_at: Date // 更新时间
  categorys: CategoryList; // 所属分类
  user_id: string // 用户 id
  email: string // 用户邮箱
}

/**
 * @description: 接口分类列表
 */
export type CategoryList = {
  id: string // uuid
  name: string // 分类名称
  desc: string // 分类描述
  user_id: string // 用户 id
  email: string // 用户邮箱
  sort: number // 排序
  apis: ApiList[]; // 接口列表
  created_at: Date // 创建时间
  updated_at: Date // 更新时间
}

/**
 * @description: 分类查询参数
 */
export type CategoryParams = PaginationParams & Partial<Pick<CategoryList, 'name'>>

/**
 * @description: 新增/编辑参数
 */
export type CategoryEdit = Pick<CategoryList, 'name' | 'sort'> &
  Partial<Pick<CategoryList, 'id' | 'desc'>>

/**
 * @description: 接口查询参数
 */
export type ApiParams = PaginationParams & Partial<Pick<ApiList, 'name' | 'category_id'>>

/**
 * @description: 新增/编辑参数
 */
export type ApiEdit = Pick<
  ApiList,
  'category_id' | 'name' | 'path' | 'pinned' | 'is_featured' | 'method' | 'sort'
> &
  Partial<Pick<ApiList, 'id' | 'desc'>>

/**
 * @description: 社交图标类型
 */
export type Social = {
  icon: string // 图标
  url?: string // 跳转地址
  tip?: string // tip 文案
}

/**
 * @description: 新闻资讯子项
 */
export type NewsResponse = {
  id: string; // 唯一 key
  title: string; // 标题
  desc?: string; // 描述
  pic?: string; // 封面图
  hot: number | string; // 热度
  tip?: string; // 如果不显示热度，显示其他信息
  url: string; // 地址
  mobileUrl: string; // 移动端地址
  label?: string; // 标签（微博）
};