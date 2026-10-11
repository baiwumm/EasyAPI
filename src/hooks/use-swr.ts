"use client";
import type { Key, SWRConfiguration } from "swr";
import type { SWRMutationConfiguration } from "swr/mutation";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

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
  );

  return {
    ...result,
    loading: result.isMutating,
  };
}

/**
 * 查询 hook：平替原 useRequest 自动模式（挂载自动请求）
 * - fetcher 为闭包：捕获调用点最新参数；key 固定时，点击刷新用 mutate()（mutate 不受 dedupingInterval 限制）
 * - loading = 首次加载或任何重新验证进行中（等价原 loading）
 * - isLoading = 仅首次加载（无缓存数据），替换式展示用它避免刷新时闪空
 * - isValidating = 任何验证进行中（含后台再验证），此时仍有旧数据，
 *   要覆盖式 spinner（不卸载结果区）就用它
 */
export function useSwrQuery<T = unknown>(
  key: Key,
  fetcher: (key?: Key) => Promise<T>,
  options?: SWRConfiguration<T>,
) {
  const result = useSWR<T>(key, fetcher, options);

  return {
    ...result,
    loading: result.isLoading || result.isValidating,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
  };
}
