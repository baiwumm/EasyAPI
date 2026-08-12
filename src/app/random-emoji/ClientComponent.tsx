'use client'
import { Copy } from '@gravity-ui/icons'
import { Button, Chip, NumberField, Table, Typography } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import EmptyContent from '@/components/EmptyContent'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TableLoading from '@/components/TableLoading'
import { useCopy } from '@/hooks/use-copy'
import { useSwrQuery } from '@/hooks/use-swr'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const { copy } = useCopy()
  const [count, setCount] = useState(10) // 生成的数量

  // 参数处理
  const params = useMemo(() => ({ count }), [count])

  // 请求数据
  const { data = [], loading, error, mutate } = useSwrQuery(
    pathname,
    async () => get(await getApiData(pathname, params), 'data', []),
  )
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <Typography type="h1" className="text-2xl font-black tracking-normal">{title}</Typography>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={mutate}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    <Table.Column isRowHeader>名称</Table.Column>
                    <Table.Column>表情</Table.Column>
                  </Table.Header>
                  <Table.Body renderEmptyState={() => <EmptyContent />}>
                    {data?.length
                      ? data.map(({ name, emoji }, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>
                              <Chip color="accent" variant="soft">{name}</Chip>
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex items-center gap-2">
                                <span>{emoji}</span>
                                <Button size="sm" variant="ghost" isIconOnly onPress={() => copy(emoji)}>
                                  <Copy className="size-4 text-muted" />
                                </Button>
                              </div>
                            </Table.Cell>
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
          <NumberField aria-label="生成的数量" maxValue={50} minValue={1} value={count} onChange={setCount}>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton loading={loading} text="生成" onPress={() => mutate()} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
