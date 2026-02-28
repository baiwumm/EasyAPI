'use client'
import { ArrowsRotateLeft, QuoteOpen } from '@gravity-ui/icons';
import { Button, Spinner } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import AlertContent from '@/components/AlertContent';
import CopyText from '@/components/CopyText';
import TypingAnimation from '@/components/TypingAnimation';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () =>
      get(await getApiData(pathname), 'data', {})
  );

  const formContent = useMemo(() => {
    return `${get(data, 'riddle', '')} ——「${get(data, 'answer', '')}」`
  }, [data]);

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
          buttonAction={run}
        />
      )
    }
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-sm text-muted font-bold">灵感正在路上...</span>
        </div>
      )
    }
    return (
      <div className="relative max-w-[85%] min-w-[20%]">
        <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
        <TypingAnimation
          text={formContent}
          typingSpeed={75}
          pauseDuration={1500}
          loop={false}
          className="text-xl sm:text-2xl py-6"
        />
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">歇后语</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <Button size='sm' isPending={loading} onPress={run} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                换一句
              </>
            )}
          </Button>
          <CopyText content={formContent} />
        </div>
      </div>
    </div>
  )
}