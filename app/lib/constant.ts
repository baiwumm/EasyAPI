import type { Social } from '~/lib/type'
import { RESPONSE_STATUS_CODE } from '~/lib/enum'

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
    url: 'https://umami.baiwumm.com/share/UHoy3xMybN92HMxF',
    tip: '网站统计'
  },
  { icon: 'i-ri-github-line', url: 'https://github.com/baiwumm', tip: 'Github' },
  { icon: 'i-ri-wechat-line', url: 'https://wechat.baiwumm.com/', tip: '微信' },
  { icon: 'i-ri-mail-line', url: 'mailto:me@baiwumm.com', tip: 'Email' },
  { icon: 'i-ri-quill-pen-line', url: 'https://baiwumm.com', tip: '博客' }
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
export function formatFail(msg = '请求失败', code = RESPONSE_STATUS_CODE.SERVER_ERROR, data: any = []) {
  return {
    code,
    msg,
    data,
    timestamp: Date.now(),
  }
}