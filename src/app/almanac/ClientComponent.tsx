'use client'
import { Calendar, Chip, DateField, DatePicker, Table } from '@heroui/react'
import { getLocalTimeZone, today } from '@internationalized/date'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import EmptyContent from '@/components/EmptyContent'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TableLoading from '@/components/TableLoading'
import { useRequest } from '@/hooks/use-request'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { DateValue } from '@heroui/react'
import type { FC } from 'react'

interface DataType {
  date: string
  hours: string
  hour: string
  yi: string
  ji: string
  chong: string
  sha: string
  nayin: string
  jiuxing: string
}

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const [date, setDate] = useState<DateValue | null>(() => today(getLocalTimeZone()))

  // 参数处理
  const params = useMemo(() => ({
    date: date?.toString() ?? '',
  }), [date])

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async () => get(await getApiData(pathname, params), 'data', []),
  )

  // 列定义
  const columns: { label: string, value: keyof DataType, className?: string }[] = [
    { label: '日期', value: 'date' },
    { label: '时段', value: 'hours', className: 'w-40' },
    { label: '时辰', value: 'hour', className: 'w-20' },
    { label: '宜', value: 'yi' },
    { label: '忌', value: 'ji' },
    { label: '冲', value: 'chong' },
    { label: '煞', value: 'sha' },
    { label: '纳音', value: 'nayin' },
    { label: '九星', value: 'jiuxing' },
  ]
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={run}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    {columns.map(({ label, value }) => (
                      <Table.Column key={value} isRowHeader={value === 'date'}>{label}</Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body renderEmptyState={() => <EmptyContent />}>
                    {data?.length
                      ? data.map((v, index) => (
                          <Table.Row key={index}>
                            {columns.map(({ value, className }) => value === 'date'
                              ? (
                                  <Table.Cell key={value} className="w-35">
                                    <Chip color="accent" variant="soft">{get(v, 'date', '--')}</Chip>
                                  </Table.Cell>
                                )
                              : (
                                  <Table.Cell key={value} className={className || 'min-w-30'}>{get(v, value, '--')}</Table.Cell>
                                ))}
                          </Table.Row>
                        ))
                      : []}
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
          <DatePicker aria-label={title} name="date" value={date} onChange={setDate} className="w-70">
            <DateField.Group fullWidth>
              <DateField.Input>{segment => <DateField.Segment segment={segment} />}</DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
              <Calendar aria-label={title}>
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
                    {day => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>{date => <Calendar.Cell date={date} />}</Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>
          <RefreshButton loading={loading} onPress={run} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
