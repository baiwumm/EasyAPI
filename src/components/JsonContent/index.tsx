'use client'
import { Table } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import CopyText from '@/components/CopyText';
import EmptyContent from '@/components/EmptyContent';
import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import TableLoading from '@/components/TableLoading';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export type Column = {
  label: string;
  children: ReactNode;
}

export type GetColumnsFn<T> = (data: T) => Column[];

type JsonContentProps<T> = {
  title: string;
  children: ReactNode;
  params: Record<string, any>;
  onRefresh: () => boolean;
  searchText?: string;
  getColumns: GetColumnsFn<T>;
}

function JsonContent<T>({ title, children, params = {}, onRefresh, searchText = '查询', getColumns }: JsonContentProps<T>) {
  const pathname = usePathname();

  // 请求数据
  const { data, loading, error, run } = useRequest<T, Record<string, any>[]>(
    async () =>
      get(await getApiData(pathname, params), 'data'),
  );

  // 请求数据
  const reload = () => {
    const flag = onRefresh();
    if (flag) {
      run();
    }
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={reload}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label={title} className="min-w-80">
                  <Table.Header>
                    <Table.Column isRowHeader>字段</Table.Column>
                    <Table.Column>值</Table.Column>
                  </Table.Header>
                  <Table.Body renderEmptyState={() => <EmptyContent />}>
                    {(data ? getColumns(data) : []).map(({ label, children }, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{label}</Table.Cell>
                        <Table.Cell>{children}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
            <TableLoading loading={loading} />
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          {children}
          <RefreshButton text={searchText} loading={loading} onPress={reload} />
          <CopyText content={Object.keys(data || {}).length > 0 ? JSON.stringify(data || {}, null, 2) : ''} />
        </div>
      </div>
    </div>
  )
}
export default JsonContent;