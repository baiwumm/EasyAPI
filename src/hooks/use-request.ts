/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Description: 自实现 useRequest，保持 ahooks 函数式签名与行为兼容
 */
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseRequestOptions<T, P extends unknown[]> {
  /** 手动触发，为 true 时不会自动执行 */
  manual?: boolean
  /** 首次执行时，传递给 service 的参数 */
  defaultParams?: P
  /** service 执行前触发 */
  onBefore?: (params: P) => void
  /** service resolve 时触发 */
  onSuccess?: (data: T, params: P) => void
  /** service reject 时触发 */
  onError?: (error: unknown, params: P) => void
  /** service 执行完成时触发 */
  onFinally?: (params: P) => void
}

/**
 * @description: 自实现 useRequest（ahooks 兼容）
 * 始终通过 ref 持有最新的 service 与回调，避免闭包过期
 */
export function useRequest<T, P extends unknown[] = []>(
  service: (...args: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {},
) {
  const {
    manual = false,
    defaultParams = [] as unknown as P,
    onBefore,
    onSuccess,
    onError,
    onFinally,
  } = options

  const serviceRef = useRef(service)
  const onBeforeRef = useRef(onBefore)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const onFinallyRef = useRef(onFinally)
  const defaultParamsRef = useRef(defaultParams)

  useEffect(() => {
    serviceRef.current = service
  })
  useEffect(() => {
    onBeforeRef.current = onBefore
  })
  useEffect(() => {
    onSuccessRef.current = onSuccess
  })
  useEffect(() => {
    onErrorRef.current = onError
  })
  useEffect(() => {
    onFinallyRef.current = onFinally
  })
  useEffect(() => {
    defaultParamsRef.current = defaultParams
  })

  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const run = useCallback(async (...args: P) => {
    onBeforeRef.current?.(args)
    setLoading(true)
    setError(undefined)

    try {
      const result = await serviceRef.current(...args)
      setData(result)
      onSuccessRef.current?.(result, args)
      return result
    }
    catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      onErrorRef.current?.(e, args)
      // 与 ahooks 一致：run 不向外抛错，错误只进入 error 状态与 onError 回调
    }
    finally {
      setLoading(false)
      onFinallyRef.current?.(args)
    }
  }, [])

  // 自动模式：挂载时执行一次（与 ahooks useRequest 语义一致，defaultParams 变化不重新请求）
  useEffect(() => {
    if (!manual) {
      run(...defaultParamsRef.current).catch(() => {})
    }
    // eslint-disable-next-line react/exhaustive-deps
  }, [])

  return {
    data,
    loading,
    error,
    run,
  }
}
