'use client'
import { QuoteOpen } from '@gravity-ui/icons';
import { Input } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, useMemo, useState } from 'react';

import AlertContent from '@/components/AlertContent';
import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import TypingAnimation from '@/components/TypingAnimation';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [author, setAuthor] = useState("李白");
  const [showFormContent, setShowFormContent] = useState(false);

  // 参数处理
  const params = useMemo(() => ({ author }), [author]);

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () =>
      get(await getApiData(pathname, params), 'data.[0]', {}), {
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

  const onSentenceComplete = () => {
    setShowFormContent(true)
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={run} loading={loading} loadingText='灵感正在路上...'>
          {!get(data, 'paragraphs', [])?.length ? (
            <AlertContent
              status="danger"
              title="暂无诗词数据，请重新输入作者名称。"
              description=""
              actionText="重新加载"
              buttonVariant="danger"
              buttonAction={run}
            />
          ) : (
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
          )}
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <Input aria-label="作者" className="w-64" placeholder="请输入诗词作者" value={author} onChange={(event) => setAuthor(event.target.value)} />
          <RefreshButton text='吟诗一首' loading={loading} onPress={run} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent;