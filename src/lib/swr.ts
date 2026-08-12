import type { SWRConfiguration } from 'swr'

/**
 * 全局 SWR 配置：平替原 useRequest 行为
 * - 关闭窗口聚焦 / 断线重连自动刷新（原实现无此行为）
 * - 失败不重试（httpRequest 网络错误直接 throw，业务失败仅 toast，均无需重试）
 * - 查询（useSWR）错误不抛出、进 error 状态；mutation 的 throwOnError: false
 *   由 use-swr.ts 的 useSwrMutation 显式关闭，等价原 run 不向外抛错
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
}
