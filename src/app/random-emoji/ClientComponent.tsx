'use client'
import { ArrowsRotateLeft, Copy } from '@gravity-ui/icons';
import { Button, Chip, NumberField, Spinner, Table } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import EmptyContent from '@/components/EmptyContent';
import TableLoading from '@/components/TableLoading';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [count, setCount] = useState(10); // 生成的数量

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ count }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ count });
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
    return (
      <div className="relative flex justify-center items-center">
        <Table>
          <Table.ScrollContainer className="max-h-150 overflow-y-auto">
            <Table.Content aria-label="随机表情" className="min-w-150">
              <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                <Table.Column>名称</Table.Column>
                <Table.Column>表情</Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => <EmptyContent />}>
                {data?.length ? data.map(({ name, emoji }, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Chip color='accent' variant='soft'>{name}</Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <span>{emoji}</span>
                        <Button isIconOnly size="sm" variant="ghost" onPress={() => copy(emoji)}>
                          <Copy className="size-4 text-muted" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )) : []}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <TableLoading loading={loading} />
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">随机表情</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField minValue={1} maxValue={50} value={count} onChange={setCount} aria-label="生成的数量">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                生成
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}