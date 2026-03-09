'use client'
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Button, Input, Spinner, Table, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import EmptyContent from '@/components/EmptyContent';
import LoadingContent from '@/components/LoadingContent';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const [keyword, setKeyword] = useState('粤');

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ keyword }]
  },
  );

  // 请求数据
  const reFresh = () => {
    if (!keyword.trim()) {
      toast.danger("参数 keyword 必填");
      return;
    }
    run({ keyword });
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
      return <LoadingContent text='正在查询...' />
    }
    return (
      <div className="flex justify-center items-center">
        <Table>
          <Table.ScrollContainer className="max-h-150 overflow-y-auto">
            <Table.Content aria-label="车牌归属地" className="min-w-150">
              <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                <Table.Column>省份</Table.Column>
                <Table.Column>城市</Table.Column>
                <Table.Column>省份车牌简称</Table.Column>
                <Table.Column>车牌号前缀</Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => <EmptyContent />}>
                {data?.length ? data.map(({ province, city, code, prefix }, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{province}</Table.Cell>
                    <Table.Cell>{city}</Table.Cell>
                    <Table.Cell>{code}</Table.Cell>
                    <Table.Cell>{prefix}</Table.Cell>
                  </Table.Row>
                )) : []}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">车牌归属地查询</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            aria-label="关键字"
            maxLength={50}
            className="w-50"
            placeholder="输入关键字，如粤A、广州市"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                查询
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}