import { Enum } from 'enum-plus';

/**
 * @description: 请求状态
 */
export const RESPONSE = Enum({
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' }
})

/**
 * @description: 主题模式
 */
export const THEME_MODE = Enum({
  LIGHT: { value: 'light', label: '亮色模式' },
  DARK: { value: 'dark', label: '暗黑模式' },
  SYSTEM: { value: 'system', label: '跟随系统' }
});

/**
 * @description: OAuth Providers
 */
export const OAUTH_PROVIDERS = Enum({
  GOOGLE: { value: 'google', label: '使用 Google 登录' },
  GITHUB: { value: 'github', label: '使用 Github 登录' },
})

/**
 * @description: Admin Tabs
 */
export const ADMIN_TABS = Enum({
  CATEGOTYS: { value: 'categorys', label: '接口分类' },
  APIS: { value: 'apis', label: '接口列表' },
})

/**
 * @description: 请求方式
 */
export const REQUEST_METHODS = Enum({
  GET: { value: 'GET', label: 'GET' },
  POST: { value: 'POST', label: 'POST' },
  PUT: { value: 'PUT', label: 'PUT' },
  DELETE: { value: 'DELETE', label: 'DELETE' },
  PATCH: { value: 'PATCH', label: 'PATCH' }
})