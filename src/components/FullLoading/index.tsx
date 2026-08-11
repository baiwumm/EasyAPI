/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 14:14:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-22 18:17:46
 * @Description: 全局 Loading
 */
'use client'
import { useIsHydrated } from '@heroui/react'

import LoadingContent from '@/components/LoadingContent'

import type { FC, ReactNode } from 'react'

interface FullLoadingProps {
  children: ReactNode
}

const FullLoading: FC<FullLoadingProps> = ({ children }) => {
  const hydrated = useIsHydrated()

  // 判断组件是否挂载
  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex w-screen h-screen justify-center items-center flex-col z-999 overflow-hidden bg-background">
        <LoadingContent text="加载中,请稍后..." />
      </div>
    )
  }
  return children
}
export default FullLoading
