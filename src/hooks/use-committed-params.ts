"use client";
import { useCallback, useState } from "react";

/**
 * 已提交参数模式：输入变化不触发请求，点击提交才更新参数。
 * SWR key 含参数对象，提交后参数变化自动重查；
 * 提交参数与当前一致时返回 false，调用方据此走手动 mutate()。
 * （收敛 postal-code/random-image/random-person 的重复实现）
 */
export function useCommittedParams<T extends object>(initial: T) {
  const [params, setParams] = useState<T>(initial);

  const commit = useCallback(
    (next: T): boolean => {
      const changed = JSON.stringify(next) !== JSON.stringify(params);

      if (changed) {
        setParams(next);
      }

      return changed;
    },
    [params],
  );

  return { params, commit };
}
