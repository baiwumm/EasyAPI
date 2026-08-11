/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Description: 自实现 useRequest，保持 ahooks 函数式签名与行为兼容
 */
import { useProgress } from '@bprogress/next'
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

// 模块级进度计数：全局进度条是共享资源，多个 useRequest 实例并发时
// 只有第一个请求 start、最后一个完成才 stop，避免互相打断或卸载后残留
let progressCount = 0

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

  const { start, stop } = useProgress()

  const serviceRef = useRef(service)
  const onBeforeRef = useRef(onBefore)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const onFinallyRef = useRef(onFinally)
  const defaultParamsRef = useRef(defaultParams)
  // 请求序号：用于丢弃过期响应，避免快速连续触发时旧数据覆盖新数据
  const requestIdRef = useRef(0)

  // 最新值同步进 ref（合并为单个 effect，避免每次 render 后执行 6 次 flush）
  useEffect(() => {
    serviceRef.current = service
    onBeforeRef.current = onBefore
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
    onFinallyRef.current = onFinally
    defaultParamsRef.current = defaultParams
  })

  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const run = useCallback(async (...args: P) => {
    const requestId = ++requestIdRef.current
    onBeforeRef.current?.(args)
    // 进度条计数（模块级）：第一个请求才 start
    if (progressCount === 0)
      start()
    progressCount++
    setLoading(true)
    setError(undefined)

    try {
      const result = await serviceRef.current(...args)
      // 过期响应直接丢弃，避免旧数据覆盖新数据
      if (requestId !== requestIdRef.current)
        return
      setData(result)
      onSuccessRef.current?.(result, args)
      return result
    }
    catch (err) {
      if (requestId !== requestIdRef.current)
        return
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      onErrorRef.current?.(e, args)
      // 与 ahooks 一致：run 不向外抛错，错误只进入 error 状态与 onError 回调
    }
    finally {
      // 最后一个请求完成才 stop，避免打断其他实例/飞行中请求的进度条
      progressCount = Math.max(0, progressCount - 1)
      if (progressCount === 0)
        stop()
      // loading 状态与 onFinally 仍只以最新一次请求为准
      if (requestId === requestIdRef.current) {
        setLoading(false)
        onFinallyRef.current?.(args)
      }
    }
  }, [start, stop])

  // 自动模式：挂载时执行一次（与 ahooks useRequest 语义一致，defaultParams 变化不重新请求）
  useEffect(() => {
    if (!manual) {
      run(...defaultParamsRef.current).catch(() => {})
    }
    // eslint-disable-next-line react/exhaustive-deps
  }, [])

  // 卸载时递增序号，使仍在飞行中的请求响应作废，避免卸载后更新状态
  useEffect(() => () => {
    requestIdRef.current++
  }, [])

  return {
    data,
    loading,
    error,
    run,
  }
}
