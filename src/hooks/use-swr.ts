'use client'
import { useProgress } from '@bprogress/next'
import { useEffect } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import type { Key, SWRConfiguration } from 'swr'
import type { SWRMutationConfiguration } from 'swr/mutation'

// 模块级进度计数：全局进度条是共享资源，多个 hook 实例并发时
// 只有第一个请求 start、最后一个完成 stop（与原 use-request.ts 语义一致）
let progressCount = 0

/**
 * 写操作 hook：平替原 useRequest(manual: true) 的 run
 * - service 直接复用现有 services 层函数（如 delApi、updateApi），不改业务代码
 * - trigger(arg) 等价原 run(arg)，失败不抛错（throwOnError: false）
 * - ⚠️ mutation key 不要与查询 key 相同，用 `${url}:save` / `${url}:delete` 等后缀区分
 */
export function useSwrMutation<T = unknown, A = unknown>(
  key: string,
  service: (arg: A) => Promise<T>,
  options?: SWRMutationConfiguration<T, Error, string, A>,
) {
  const result = useSWRMutation<T, Error, string, A>(
    key,
    (_key, { arg }) => service(arg),
    { throwOnError: false, ...options },
  )
  useProgressSync(result.isMutating)

  return {
    ...result,
    loading: result.isMutating,
  }
}

/**
 * 查询 hook：平替原 useRequest 自动模式（挂载自动请求）
 * - fetcher 为闭包：捕获调用点最新参数；key 固定时，点击刷新用 mutate()（mutate 不受 dedupingInterval 限制）
 * - loading = 首次加载或任何重新验证进行中（等价原 loading）
 */
export function useSwrQuery<T = unknown>(
  key: Key,
  fetcher: (key?: Key) => Promise<T>,
  options?: SWRConfiguration<T>,
) {
  const result = useSWR<T>(key, fetcher, options)
  useProgressSync(result.isValidating)

  return {
    ...result,
    loading: result.isLoading || result.isValidating,
  }
}

/** 进度条同步：active 为 true 期间持有进度条，多个实例并发互不打断 */
function useProgressSync(active: boolean) {
  const { start, stop } = useProgress()

  useEffect(() => {
    if (!active)
      return
    if (progressCount === 0)
      start()
    progressCount++
    return () => {
      progressCount = Math.max(0, progressCount - 1)
      if (progressCount === 0)
        stop()
    }
  }, [active, start, stop])
}
