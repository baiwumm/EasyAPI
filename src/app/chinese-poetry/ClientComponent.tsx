'use client'
import { ArrowsRotateLeft, QuoteOpen } from '@gravity-ui/icons';
import { Button, Input, Spinner } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import AlertContent from '@/components/AlertContent';
import LoadingContent from '@/components/LoadingContent';
import TypingAnimation from '@/components/TypingAnimation';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const [author, setAuthor] = useState("李白");
  const [showFormContent, setShowFormContent] = useState(false);

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data.[0]', {}), {
    defaultParams: [{ author }],
    onBefore: () => {
      setShowFormContent(false);
    },
  }
  );

  // 右下角来源信息
  const formContent = useMemo(() => {
    const paragraphs = get(data, 'paragraphs', []);
    const author = get(data, 'author');
    const title = get(data, 'title', '');
    return paragraphs?.length ? `—— ${author || ''}${title ? `《${title}》` : ""}` : ""
  }, [data]);

  // 请求数据
  const reFresh = () => {
    run({ author });
  }

  const onSentenceComplete = () => {
    setShowFormContent(true)
  }

  // 渲染内容
  const renderContent = () => {
    if (error) {
      return (
        <AlertContent
          status="danger"
          title="请求失败"
          description="服务暂时不可用，请稍后重试。"
          actionText="重新加载"
          buttonVariant="danger"
          buttonAction={reFresh}
        />
      )
    }
    if (loading) {
      return <LoadingContent text='灵感正在路上...' />
    }
    if (!get(data, 'paragraphs', [])?.length) {
      return (
        <AlertContent
          status="danger"
          title="暂无诗词数据，请重新输入作者名称。"
          description=""
          actionText="重新加载"
          buttonVariant="danger"
          buttonAction={reFresh}
        />
      )
    }
    return (
      <div className="relative max-w-[85%] min-w-[20%]">
        <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
        <TypingAnimation
          text={get(data, 'paragraphs', []).join('\n')}
          typingSpeed={75}
          pauseDuration={1500}
          loop={false}
          className="text-xl sm:text-2xl py-6"
          onSentenceComplete={onSentenceComplete}
        />
        {showFormContent && formContent ? (
          <TypingAnimation
            text={formContent}
            typingSpeed={75}
            pauseDuration={1500}
            loop={false}
            showCursor={false}
            className="absolute -bottom-4 right-0 text-muted"
          />
        ) : null}
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">中文诗词</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <Input aria-label="作者" className="w-64" placeholder="请输入诗词作者" value={author} onChange={(event) => setAuthor(event.target.value)} />
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                吟诗一首
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}