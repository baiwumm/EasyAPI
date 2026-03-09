'use client'
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Avatar, Button, Chip, Description, ListBox, NumberField, Select, Spinner, Table } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import EmptyContent from '@/components/EmptyContent';
import TableLoading from '@/components/TableLoading';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const [count, setCount] = useState(5);
  const [gender, setGender] = useState('all');

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ count, gender }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ count, gender });
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
            <Table.Content aria-label="随机用户" className="min-w-150">
              <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                <Table.Column isRowHeader>姓名</Table.Column>
                <Table.Column>性别</Table.Column>
                <Table.Column>手机号码</Table.Column>
                <Table.Column>公司</Table.Column>
                <Table.Column>职位</Table.Column>
                <Table.Column>生日</Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => <EmptyContent />}>
                {data?.length ? data.map(({ id, name, avatar, gender, email, job, phone, birthday, company }) => (
                  <Table.Row key={id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <Avatar.Image src={avatar} />
                          <Avatar.Fallback>
                            {(name as string)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs">{name}</span>
                          <Description>{email}</Description>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell><Chip color={gender === '男' ? 'accent' : 'warning'} variant='soft' className="rounded-full">{gender}</Chip></Table.Cell>
                    <Table.Cell>{phone}</Table.Cell>
                    <Table.Cell>{company}</Table.Cell>
                    <Table.Cell>{job}</Table.Cell>
                    <Table.Cell>{birthday}</Table.Cell>
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
        <h1 className="text-2xl font-black">随机用户</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField
            minValue={1}
            maxValue={20}
            value={count}
            onChange={setCount}
            aria-label="数量"
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-30" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <Select
            className="w-50"
            placeholder="请选择性别"
            aria-label="性别"
            value={gender}
            onChange={(value) => setGender(value as string)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                <ListBox.Item id="all" textValue="随机">
                  随机
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="male" textValue="男">
                  男
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="female" textValue="女">
                  女
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
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