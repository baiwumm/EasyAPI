'use client'
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Button, Calendar, Chip, DateField, DatePicker, type DateValue, Spinner, Table } from '@heroui/react';
import { getLocalTimeZone, today } from "@internationalized/date";
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import EmptyContent from '@/components/EmptyContent';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ date: date ? date.toString() : '' }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ date: date ? date.toString() : '' });
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
      return (
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-sm text-muted font-bold">正在查询...</span>
        </div>
      )
    }
    return (
      <div className="flex justify-center items-center">
        <Table>
          <Table.ScrollContainer className="max-h-150 overflow-y-auto">
            <Table.Content aria-label="法定节假日" className="min-w-150">
              <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                <Table.Column>日期</Table.Column>
                <Table.Column>时段</Table.Column>
                <Table.Column>时辰</Table.Column>
                <Table.Column>宜</Table.Column>
                <Table.Column>忌</Table.Column>
                <Table.Column>冲</Table.Column>
                <Table.Column>煞</Table.Column>
                <Table.Column>纳音</Table.Column>
                <Table.Column>九星</Table.Column>
              </Table.Header>
              <Table.Body renderEmptyState={() => <EmptyContent />}>
                {data?.length ? data.map(({ date, hours, hour, yi, ji, chong, sha, nayin, jiuxing }, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="w-35">
                      <Chip color='accent' variant='soft'>{date}</Chip>
                    </Table.Cell>
                    <Table.Cell className="w-40">{hours}</Table.Cell>
                    <Table.Cell className="w-20">{hour}</Table.Cell>
                    <Table.Cell className="min-w-30">{yi}</Table.Cell>
                    <Table.Cell className="min-w-30">{ji}</Table.Cell>
                    <Table.Cell className="min-w-30">{chong}</Table.Cell>
                    <Table.Cell className="min-w-30">{sha}</Table.Cell>
                    <Table.Cell className="min-w-30">{nayin}</Table.Cell>
                    <Table.Cell className="min-w-30">{jiuxing}</Table.Cell>
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
        <h1 className="text-2xl font-black">十二时辰黄历</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <DatePicker className="w-70" name="date" value={date} onChange={setDate}>
            <DateField.Group fullWidth>
              <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
              <Calendar aria-label="十二时辰黄历">
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>
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