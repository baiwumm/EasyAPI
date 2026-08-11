/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 09:42:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-22 18:20:32
 * @Description: 上下文提供者
 */
'use client'
import { AppProgressProvider as ProgressProvider } from '@bprogress/next'
import dynamic from 'next/dynamic'
import { useEffect, ViewTransition } from 'react'

import Header from '@/components/Header'

import type { FC, PropsWithChildren } from 'react'

/** 返回顶部按钮：纯交互增强，首屏不需要，拆为独立 chunk 客户端懒加载 */
const BackTop = dynamic(() => import('@/components/BackTop'), { ssr: false })

/** 后退方向标记保留时间，动画结束后清除，避免影响后续前进导航 */
const NAV_DIR_RESET_DELAY = 1000

const Providers: FC<PropsWithChildren> = ({ children }) => {
  // 浏览器前进/后退会触发 popstate，此时标记「后退」让路由转场反向滑动；
  // 普通链接跳转（pushState）不触发 popstate，默认按「前进」处理
  useEffect(() => {
    const root = document.documentElement
    let timer: number | undefined
    const markBackward = () => {
      root.dataset.navDir = 'backward'
      window.clearTimeout(timer)
      timer = window.setTimeout(() => delete root.dataset.navDir, NAV_DIR_RESET_DELAY)
    }
    window.addEventListener('popstate', markBackward)
    return () => {
      window.removeEventListener('popstate', markBackward)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <ProgressProvider color="var(--accent)" options={{ showSpinner: true }} shallowRouting>
      {/* 顶部 */}
      <Header />
      {/* 主体内容 */}
      <ViewTransition name="blur-slide">
        <main className="flex-1 min-h-0 container mx-auto p-4 flex flex-col gap-4">
          {children}
        </main>
      </ViewTransition>
      <BackTop />
    </ProgressProvider>
  )
}
export default Providers
