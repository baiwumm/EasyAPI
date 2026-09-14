import type { PaginationState } from "@tanstack/react-table";
import type { REQUEST_METHODS } from "@/enums";

/** @description: 公共列 */
export interface Columns {
  id: string; // 主键
  user_id: string; // 登录用户 id
  emial: string; // 邮箱
  sort: number; // 排序
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
}

/** @description: 接口列表 */
export type Api = Columns & {
  category_id: string; // 所属分类
  name: string; // 接口名称
  desc?: string; // 接口描述
  path: string; // 接口 url
  method: typeof REQUEST_METHODS.valueType; // 请求方式
  pinned: boolean; // 是否置顶
  is_featured: boolean; // 是否推荐
  call_count: number; // 调用次数
  last_called: Date; // 最后调用时间
  category: Category; // 所属分类
  operation_id: string;
};

/** @description: 接口分类 */
export type Category = Columns & {
  name: string; // 分类名称
  desc?: string; // 分类描述
  apis: Api[]; // 网站列表
};

/** @description: 分页参数 */
export type PaginatingParams = PaginationState;

/** @description: 接口查询参数 */
export type ApiQueryParams = PaginatingParams &
  Partial<
    Pick<Api, "name"> & {
      category_id: string;
    }
  >;

/** @description: 接口列表表单 */
export type ApiSaveParams = Pick<
  Api,
  | "category_id"
  | "name"
  | "desc"
  | "path"
  | "method"
  | "pinned"
  | "is_featured"
  | "operation_id"
  | "sort"
> & {
  id?: string;
};

/** @description: 接口分类查询参数 */
export type CategoryQueryParams = PaginatingParams &
  Partial<Pick<Category, "name">>;

/** @description: 接口分类表单 */
export type CategorySaveParams = Pick<Category, "name" | "desc" | "sort"> & {
  id?: string;
};

/** @description: 客户端组件 Props */
export interface ClientComponentProps {
  title: string;
}

/** @description: 响应体 */
export interface IResponse<T = unknown> {
  code: number; // 状态码
  data: T; // 数据
  msg: string; // 消息
  timestamp: number; // 时间戳
}

/** @description: 分页响应体 */
export type PaginatingResponse<T = unknown> = {
  total: number; // 总条数
  list: T[];
  page: number; // 页码
  pageSize: number; // 每页条数
} & PaginatingParams;
