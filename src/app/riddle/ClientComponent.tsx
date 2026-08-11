'use client'
import { QuoteOpen } from '@gravity-ui/icons'
import { useRequest } from 'ahooks'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import CopyText from '@/components/CopyText'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TypingAnimation from '@/components/TypingAnimation'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () =>
      get(await getApiData(pathname), 'data', {}),
  )

  const formContent = useMemo(() => {
    return `${get(data, 'riddle', '')} ——「${get(data, 'answer', '')}」`
  }, [data])
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} loading={loading} loadingText="灵感正在路上..." reFresh={run}>
          <div className="relative max-w-[85%] min-w-[20%]">
            <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
            <TypingAnimation
              loop={false}
              pauseDuration={1500}
              text={formContent}
              typingSpeed={75}
              className="text-xl sm:text-2xl py-6"
            />
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <RefreshButton loading={loading} text="换一句" onPress={run} />
          <CopyText content={formContent} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
