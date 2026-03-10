'use client'
import { Chip, Input, ListBox, Select, Table, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, useMemo, useState } from 'react';

import CopyText from '@/components/CopyText';
import EmptyContent from '@/components/EmptyContent';
import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import TableLoading from '@/components/TableLoading';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

type Type = 1 | 2;

type PostalCode = {
  province: string;
  city: string;
  area: string[]
  areaCode: string;
  postCode: string;
}

const title = '邮政编码查询';

const ClientComponent: FC = () => {
  const pathname = usePathname();
  const [type, setType] = useState<Type>(1);
  const [keyword, setKeyword] = useState('524200');

  // 参数处理
  const params = useMemo(() => ({ keyword, type }), [keyword, type]);

  // 请求数据
  const { data, loading, error, run } = useRequest<PostalCode | PostalCode[], { keyword: string, type: number }[]>(
    async () => get(await getApiData(pathname, params), 'data'),
  );

  // 请求数据
  const reload = () => {
    if (!keyword?.trim()) {
      toast.danger("参数 keyWord 必填");
      return;
    }
    run()
  }

  // 列定义
  const columns: { label: string, value: keyof PostalCode }[] = [
    { label: '邮政编码', value: 'postCode' },
    { label: '省份', value: 'province' },
    { label: '城市', value: 'city' },
    { label: '区县', value: 'area' },
    { label: '电话区号', value: 'areaCode' }
  ]
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
                  {Array.isArray(data) || type === 2 ? (
                    <>
                      <Table.Header>
                        {columns.map(({ label, value }) => (
                          <Table.Column key={value} isRowHeader={value === 'postCode'}>{label}</Table.Column>
                        ))}
                      </Table.Header>
                      <Table.Body renderEmptyState={() => <EmptyContent />}>
                        {(Array.isArray(data) ? data : []).map(({ postCode, province, city, area, areaCode }, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>
                              <Chip>{postCode}</Chip>
                            </Table.Cell>
                            <Table.Cell>{province}</Table.Cell>
                            <Table.Cell>{city}</Table.Cell>
                            <Table.Cell>{area}</Table.Cell>
                            <Table.Cell>{areaCode}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </>
                  ) : (
                    <>
                      <Table.Header>
                        <Table.Column isRowHeader>字段</Table.Column>
                        <Table.Column>值</Table.Column>
                      </Table.Header>
                      <Table.Body renderEmptyState={() => <EmptyContent />}>
                        {columns.map(({ label, value }) => (
                          <Table.Row key={value}>
                            <Table.Cell>{label}</Table.Cell>
                            <Table.Cell>{value === 'postCode' ? <Chip variant='soft' color='accent'>{get(data, 'postCode', '--')}</Chip> : get(data, value, '--')}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </>
                  )}
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
          <Select className="w-50" placeholder="请选择" aria-label="邮政编码" value={type} onChange={(value) => setType(value as Type)}>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id={1} textValue="邮编查地区">
                  邮编查地区
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id={2} textValue="地区查邮编">
                  地区查邮编
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
          <Input
            value={keyword}
            maxLength={50}
            onChange={(event) => setKeyword(event.target.value)}
            aria-label="关键字"
            placeholder='请输入关键字'
            className="w-50"
          />
          <RefreshButton text='查询' loading={loading} onPress={reload} />
          <CopyText content={Object.keys(data || {}).length > 0 ? JSON.stringify(data || {}, null, 2) : ''} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent;