/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-27 10:56:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-27 13:42:52
 * @Description: 复制文案
 */
'use client'
import { Check, CircleCheck, CircleXmark, Copy } from '@gravity-ui/icons'
import { Button, toast } from '@heroui/react'
import { type FC, useCallback, useRef, useState } from 'react'

import useClipboard from '@/hooks/use-clipboard';

type CopyTextProps = {
  content: string
  timeout?: number
}

const CopyText: FC<CopyTextProps> = ({
  content = '',
  timeout = 3000,
}) => {
  const { copy, isSupported } = useClipboard();
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetState = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setCopied(false)
    }, timeout)
  }, [timeout])

  const handleCopy = useCallback(async () => {
    // 已复制状态时不重复执行
    if (copied) return

    // 无内容
    if (!content) {
      toast.danger('复制失败，缺少内容!', {
        indicator: <CircleXmark />,
      })
      return
    }

    // 浏览器不支持
    if (!isSupported) {
      toast.danger('复制失败，当前浏览器不支持！', {
        indicator: <CircleXmark />,
      })
      return
    }

    try {
      await copy(content, content)

      setCopied(true)

      toast.success('复制成功', {
        indicator: <CircleCheck />,
      })

      resetState()
    } catch {
      toast.danger('复制失败，请手动复制!', {
        indicator: <CircleXmark />,
      })
    }
  }, [content, copied, isSupported, resetState, copy])

  return (
    <Button
      size="sm"
      variant="tertiary"
      onPress={handleCopy}
      isDisabled={copied}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? '已复制' : '复制'}
    </Button>
  )
}

export default CopyText