/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-06 16:24:38
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 16:39:55
 * @Description: 全局复制 hooks
 */
import { CircleCheck, CircleXmark } from '@gravity-ui/icons'
import { toast } from '@heroui/react'
import { useMemo } from 'react'

export function useCopy() {
  // 检查剪贴板API是否可用
  const isSupported = useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false
    }

    return (
      'clipboard' in navigator &&
      'writeText' in navigator.clipboard &&
      window.isSecureContext
    )
  }, [])

  const copy = async (content?: string) => {
    // 无内容
    if (!content) {
      toast.danger('复制失败，缺少内容!', {
        indicator: <CircleXmark />,
      })
      return false
    }

    // 浏览器不支持
    if (!isSupported) {
      toast.danger('复制失败，当前浏览器不支持！', {
        indicator: <CircleXmark />,
      })
      return false
    }

    try {
      await navigator.clipboard.writeText(content)

      toast.success('复制成功', {
        indicator: <CircleCheck />,
      })

      return true
    } catch {
      toast.danger('复制失败，请手动复制!', {
        indicator: <CircleXmark />,
      })

      return false
    }
  }

  return {
    copy,
    isSupported,
  }
}