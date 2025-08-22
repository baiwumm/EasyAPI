import type { CategoryList } from '~/lib/type'

/**
 * @description: 接口分类配置，静态数据
 */
export const CategoryOptions: CategoryList[] = [
  {
    title: '新闻资讯',
    children: [
      {
        name: '微博热搜',
        path: '/weibo',
        operationId: 'getWeiboHotList'
      }
    ]
  },
  {
    title: '每日推荐',
    children: [
      {
        name: '每日一言',
        path: '/hitokoto',
        operationId: 'getHitokoto',
        is_featured: true
      }
    ]
  }
]