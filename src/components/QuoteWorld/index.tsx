/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 09:53:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 09:32:10
 * @Description: 一言文案
 */
'use client'
import { QuoteOpen } from '@gravity-ui/icons'
import { Typography } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import CopyText from '@/components/CopyText'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TypingAnimation from '@/components/TypingAnimation'
import { useSwrQuery } from '@/hooks/use-swr'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

interface QuoteWorldProps {
  title: string
  formWhoField?: string
  fromField?: string
}

const QuoteWorld: FC<QuoteWorldProps> = ({ title, formWhoField = '', fromField = '' }) => {
  const pathname = usePathname()
  const [showFormContent, setShowFormContent] = useState(false)

  // 请求数据（key 固定为路由，参数走闭包；点击刷新用 mutate）
  const { data = {}, loading, error, mutate } = useSwrQuery(
    pathname,
    async () =>
      get(await getApiData(pathname), 'data', {}),
  )

  // 刷新入口：原 onBefore 的 UI 重置逻辑在请求前执行
  const handleRefresh = () => {
    setShowFormContent(false)
    mutate()
  }

  // 右下角来源信息
  const formContent = useMemo(() => {
    if (!formWhoField || !fromField) {
      return null
    }
    const content = get(data, 'content', '')
    const from_who = get(data, formWhoField)
    const from = get(data, fromField, '')
    return content ? `—— ${from_who || ''}${from ? `「${from}」` : ''}` : ''
  }, [data, formWhoField, fromField])

  // 稳定引用：避免每次渲染新建函数导致 TypingAnimation 的 effect 重跑
  const onSentenceComplete = useCallback(() => {
    setShowFormContent(true)
  }, [])
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <Typography type="h1" className="text-2xl font-black tracking-normal">{title}</Typography>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} loading={loading} loadingText="灵感正在路上..." reFresh={handleRefresh}>
          <div className="relative max-w-[85%] min-w-[20%]">
            <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
            <TypingAnimation
              loop={false}
              pauseDuration={1500}
              text={get(data, 'content', '服务器开小差了...')}
              typingSpeed={75}
              onSentenceComplete={onSentenceComplete}
              className="text-xl sm:text-2xl py-6"
            />
            {showFormContent && formContent
              ? (
                  <TypingAnimation
                    loop={false}
                    pauseDuration={1500}
                    showCursor={false}
                    text={formContent}
                    typingSpeed={75}
                    className="absolute -bottom-4 right-0 text-muted"
                  />
                )
              : null}
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <RefreshButton loading={loading} text="换一句" onPress={handleRefresh} />
          <CopyText content={get(data, 'content', '')} />
        </div>
      </div>
    </div>
  )
}
export default QuoteWorld
