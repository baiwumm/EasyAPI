import type { Social } from '~/lib/type'
import type { SelectItem } from '#ui/types'
import { REQUEST_METHOD } from '~/lib/enum'

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
 * @description: 请求方式
 */
export const RequestMethodOptions: SelectItem[] = [
  { label: REQUEST_METHOD.GET, value: REQUEST_METHOD.GET, icon: 'tabler:http-get' },
  { label: REQUEST_METHOD.POST, value: REQUEST_METHOD.POST, icon: 'tabler:http-post' },
  { label: REQUEST_METHOD.PATCH, value: REQUEST_METHOD.PATCH, icon: 'tabler:http-patch' },
  { label: REQUEST_METHOD.PUT, value: REQUEST_METHOD.PUT, icon: 'tabler:http-put' },
  { label: REQUEST_METHOD.DELETE, value: REQUEST_METHOD.DELETE, icon: 'tabler:http-delete' },
]
