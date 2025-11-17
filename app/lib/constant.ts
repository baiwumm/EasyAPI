import type { Social } from '~/lib/type'
import { RESPONSE_STATUS_CODE } from '~/lib/enum'
import type { SelectItem } from '#ui/types'
import { REQUEST_METHOD } from '~/lib/enum'
import pkg from '../../package.json'

/**
 * @description: 底部备案
 */
export const FooterRecord: Social[] = [
  {
    icon: 'icp.png',
    url: 'https://beian.miit.gov.cn/#/Integrated/index',
    tip: '粤ICP备2023007649号-3'
  },
  {
    icon: 'beian.png',
    url: 'https://beian.mps.gov.cn/#/query/webSearch',
    tip: '粤公网安备44030002003295号'
  }
]

/**
 * @description: 社交图标
 */
export const FooterSocial: Social[] = [
  {
    icon: 'ri:bar-chart-2-line',
    url: 'https://um.baiwumm.com/share/1pv7JW0MdRPqy4nr',
    tip: '网站统计'
  },
  { icon: 'i-ri-github-line', url: `https://github.com/${pkg.author.name}`, tip: 'Github' },
  { icon: 'i-ri-mail-line', url: `mailto:${pkg.author.email}`, tip: 'Email' },
  { icon: 'i-ri-quill-pen-line', url: pkg.author.url, tip: '博客' }
]

/**
 * @description: 统一响应成功格式
 */
export function formatSuccess<T = any>(data: T, msg = '请求成功') {
  return {
    code: RESPONSE_STATUS_CODE.SUCCESS,
    msg,
    data,
    timestamp: Date.now(),
  }
}

/**
 * @description: 统一响应失败格式
 */
export function formatFail(msg = '请求失败', data = {}, code = RESPONSE_STATUS_CODE.SERVER_ERROR) {
  return {
    code,
    msg,
    data,
    timestamp: Date.now(),
  }
}

/**
 * @description: 请求方式
 */
export const RequestMethodOptions: SelectItem[] = [
  { label: REQUEST_METHOD.GET, value: REQUEST_METHOD.GET, icon: 'tabler:http-get' },
  { label: REQUEST_METHOD.POST, value: REQUEST_METHOD.POST, icon: 'tabler:http-post' },
  { label: REQUEST_METHOD.PATCH, value: REQUEST_METHOD.PATCH, icon: 'tabler:http-patch' },
  { label: REQUEST_METHOD.PUT, value: REQUEST_METHOD.PUT, icon: 'tabler:http-put' },
  { label: REQUEST_METHOD.DELETE, value: REQUEST_METHOD.DELETE, icon: 'tabler:http-delete' },
]

/**
 * @description: 微博爆点配置
 */
export const hotLableColor: Record<string, string> = {
  热: '#ff9406',
  沸: '#f86400',
  新: '#ff3852',
  暖: '#ffab5a',
  爆: '#bd0000',
};

/**
 * @description: Tag 颜色配置
 */
export const hotTagColor: Record<string, string> = {
  0: '#ea444d',
  1: '#ed702d',
  2: '#eead3f',
};
