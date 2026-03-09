'use client'
import { ArrowsRotateLeft, QuoteOpen } from '@gravity-ui/icons';
import { Button, type Key, Spinner, Tag, TagGroup } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import AlertContent from '@/components/AlertContent';
import CopyText from '@/components/CopyText';
import LoadingContent from '@/components/LoadingContent';
import TypingAnimation from '@/components/TypingAnimation';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const typesOptions = [
  { value: "a", label: "动画" },
  { value: "b", label: "漫画" },
  { value: "c", label: "游戏" },
  { value: "d", label: "文学" },
  { value: "e", label: "原创" },
  { value: "f", label: "网络" },
  { value: "g", label: "其他" },
  { value: "h", label: "影视" },
  { value: "i", label: "诗词" },
  { value: "j", label: "网易云" },
  { value: "k", label: "哲学" },
  { value: "l", label: "抖机灵" },
];

export default function ClientComponent() {
  const pathname = usePathname();
  const [selected, setSelected] = useState<Iterable<Key>>(new Set([]));
  const [showFormContent, setShowFormContent] = useState(false);

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', {}), {
    onBefore: () => {
      setShowFormContent(false);
    },
  }
  );

  // 右下角来源信息
  const formContent = useMemo(() => {
    const content = get(data, 'content', '');
    const from_who = get(data, 'from_who');
    const from = get(data, 'from', '');
    return content ? `—— ${from_who || ''}${from ? `「${from}」` : ""}` : ""
  }, [data]);

  // 请求数据
  const reFresh = () => {
    run({
      types: Array.from(selected).join(',')
    });
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
    return (
      <div className="relative max-w-[85%] min-w-[20%]">
        <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
        <TypingAnimation
          text={get(data, 'content', '服务器开小差了...')}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
          <h1 className="text-2xl font-black justify-self-start">每日一言</h1>
          <div className="justify-self-start lg:justify-self-center">
            <TagGroup selectionMode="multiple" size="sm" onSelectionChange={(keys) => setSelected(keys)} aria-label="筛选类型" >
              <TagGroup.List className="lg:flex-nowrap min-w-0 sm:min-w-max">
                {typesOptions.map((item) => (
                  <Tag key={item.value} id={item.value}>{item.label}</Tag>
                ))}
              </TagGroup.List>
            </TagGroup>
          </div>
        </div>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                换一句
              </>
            )}
          </Button>
          <CopyText content={get(data, 'content', '')} />
        </div>
      </div>
    </div>
  )
}