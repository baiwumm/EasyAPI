/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 09:53:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 09:32:10
 * @Description: 一言文案
 */
'use client'
import { QuoteOpen } from '@gravity-ui/icons';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, useMemo, useState } from 'react';

import CopyText from '@/components/CopyText';
import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import TypingAnimation from '@/components/TypingAnimation';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

type QuoteWorldProps = {
  title: string;
  formWhoField?: string;
  fromField?: string;
}

const QuoteWorld: FC<QuoteWorldProps> = ({ title, formWhoField = '', fromField = '' }) => {
  const pathname = usePathname();
  const [showFormContent, setShowFormContent] = useState(false);

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () =>
      get(await getApiData(pathname), 'data', {}), {
    onBefore: () => {
      setShowFormContent(false);
    },
  }
  );

  // 右下角来源信息
  const formContent = useMemo(() => {
    if (!formWhoField || !fromField) {
      return null
    }
    const content = get(data, 'content', '');
    const from_who = get(data, formWhoField);
    const from = get(data, fromField, '');
    return content ? `—— ${from_who || ''}${from ? `「${from}」` : ""}` : ""
  }, [data, formWhoField, fromField]);

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
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <RefreshButton text='换一句' loading={loading} onPress={run} />
          <CopyText content={get(data, 'content', '')} />
        </div>
      </div>
    </div>
  )
}
export default QuoteWorld