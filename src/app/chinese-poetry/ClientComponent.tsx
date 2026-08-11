'use client'
import { QuoteOpen } from '@gravity-ui/icons'
import { Input } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import AlertContent from '@/components/AlertContent'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TypingAnimation from '@/components/TypingAnimation'
import { useRequest } from '@/hooks/use-request'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const [author, setAuthor] = useState('李白')
  const [showFormContent, setShowFormContent] = useState(false)

  // 参数处理
  const params = useMemo(() => ({ author }), [author])

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () =>
      get(await getApiData(pathname, params), 'data.[0]', {}),
    {
      onBefore: () => {
        setShowFormContent(false)
      },
    },
  )

  // 右下角来源信息
  const formContent = useMemo(() => {
    const paragraphs = get(data, 'paragraphs', [])
    const author = get(data, 'author')
    const title = get(data, 'title', '')
    return paragraphs?.length ? `—— ${author || ''}${title ? `《${title}》` : ''}` : ''
  }, [data])

  // 稳定引用：避免每次渲染新建函数导致 TypingAnimation 的 effect 重跑
  const onSentenceComplete = useCallback(() => {
    setShowFormContent(true)
  }, [])
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} loading={loading} loadingText="灵感正在路上..." reFresh={run}>
          {!get(data, 'paragraphs', [])?.length
            ? (
                <AlertContent
                  title="暂无诗词数据，请重新输入作者名称。"
                  actionText="重新加载"
                  buttonAction={run}
                  buttonVariant="danger"
                  description=""
                  status="danger"
                />
              )
            : (
                <div className="relative max-w-[85%] min-w-[20%]">
                  <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
                  <TypingAnimation
                    loop={false}
                    pauseDuration={1500}
                    text={get(data, 'paragraphs', []).join('\n')}
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
              )}
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <Input aria-label="作者" placeholder="请输入诗词作者" value={author} onChange={event => setAuthor(event.target.value)} className="w-64" />
          <RefreshButton loading={loading} text="吟诗一首" onPress={run} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
