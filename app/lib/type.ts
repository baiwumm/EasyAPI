import type { RESPONSE_STATUS_CODE } from '~/lib/enum'

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
