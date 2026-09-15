/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 14:14:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-22 18:17:46
 * @Description: 全局 Loading（hydration 完成前的全屏过渡遮罩）
 * 注意：children 必须始终渲染。此前水合前会把整棵子树替换为 Splash，
 * SSR HTML 里只有"加载中"，不执行 JS 的爬虫抓到的是空站，LCP 也被推迟；
 * 现在内容正常输出到 HTML，遮罩仅作视觉过渡，水合完成后自动移除。
 */
"use client";
import type { FC, ReactNode } from "react";

import { Description, Spinner, useIsHydrated } from "@heroui/react";

interface FullLoadingProps {
  children: ReactNode;
}

const FullLoading: FC<FullLoadingProps> = ({ children }) => {
  const hydrated = useIsHydrated();

  return (
    <>
      {children}
      {!hydrated && (
        <div className="app-full-loading fixed inset-0 z-999 flex h-dvh w-screen flex-col items-center justify-center overflow-hidden bg-background">
          <div className="flex flex-col items-center gap-2">
            <Spinner />
            <Description className="font-black">加载中,请稍后...</Description>
          </div>
        </div>
      )}
    </>
  );
};

export default FullLoading;
