/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-07 09:36:26
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-07 09:54:35
 * @Description: 根据路由获取请求地址
 */

export const usePath = () => {
  // 获取路由路劲
  const route = useRoute();

  return `/api${route.path}`
}
