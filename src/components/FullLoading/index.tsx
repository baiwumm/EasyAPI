/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-28 14:14:54
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-22 18:17:46
 * @Description: 全局 Loading
 */
import type { FC, ReactNode } from 'react'

interface FullLoadingProps {
  children: ReactNode
}

/**
 * 直接透传 children：SSR 输出的真实内容立即可见。
 * 不再在 hydration 前用全屏 loading 遮罩覆盖内容（会推迟 LCP/TTI 且产生闪烁），
 * 路由转场加载态由 loading.tsx 与 @bprogress 提供。
 */
const FullLoading: FC<FullLoadingProps> = ({ children }) => {
  return children
}
export default FullLoading
