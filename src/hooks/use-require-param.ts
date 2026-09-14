"use client";
import { toast } from "@heroui/react";
import { useCallback } from "react";

/**
 * 参数必填守卫：空值统一 toast 提示并返回 false
 * （收敛此前 barcode/qrcode/country-code/license-plate/postal-code
 * 五处复制粘贴的守卫逻辑）
 */
export function useRequireParam() {
  return useCallback((value: string | null | undefined, label = "text") => {
    if (value?.trim()) {
      return true;
    }

    toast.danger(`参数 ${label} 必填`);

    return false;
  }, []);
}
