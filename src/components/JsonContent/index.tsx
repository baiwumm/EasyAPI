'use client'
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Button, Card, ScrollShadow, Spinner } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, type ReactNode } from 'react';

import AlertContent from '@/components/AlertContent';
import CopyText from '@/components/CopyText';
import LoadingContent from '@/components/LoadingContent';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

type JsonContentProps = {
  title: string;
  children: ReactNode;
  params: Record<string, any>;
  onRefresh: () => boolean;
  searchText?: string;
}

const JsonContent: FC<JsonContentProps> = ({ title, children, params = {}, onRefresh, searchText = '查询' }) => {
  const pathname = usePathname();

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () =>
      get(await getApiData(pathname, params), 'data', {}),
  );

  // 请求数据
  const reload = () => {
    const flag = onRefresh();
    if (flag) {
      run();
    }
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
          buttonAction={reload}
        />
      )
    }
    if (loading) {
      return <LoadingContent text={`正在${searchText}...`} />
    }
    return (
      <div className="flex justify-center items-center w-full">
        <Card className="max-w-full p-0">
          <Card.Content>
            <ScrollShadow className="max-h-100 p-4" orientation="vertical">
              <pre><code style={{ fontFamily: 'Maple Mono CN' }}>{JSON.stringify(data, null, 2)}</code></pre>
            </ScrollShadow>
          </Card.Content>
        </Card>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {children}
          <Button size='sm' isPending={loading} onPress={reload} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                {searchText}
              </>
            )}
          </Button>
          <CopyText content={Object.keys(data || {}).length > 0 ? JSON.stringify(data || {}, null, 2) : ''} />
        </div>
      </div>
    </div>
  )
}
export default JsonContent;