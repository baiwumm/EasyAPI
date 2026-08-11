'use client'
import { Input, Table, toast } from '@heroui/react'
import { useRequest } from 'ahooks'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import EmptyContent from '@/components/EmptyContent'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TableLoading from '@/components/TableLoading'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

interface DataType {
  province: string
  city: string
  code: string[]
  prefix: string
}

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const [keyword, setKeyword] = useState('粤')

  // 参数处理
  const params = useMemo(() => ({ keyword }), [keyword])

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async () => get(await getApiData(pathname, params), 'data', []),
  )

  // 请求数据
  const reFresh = () => {
    if (!keyword.trim()) {
      toast.danger('参数 keyword 必填')
      return
    }
    run()
  }

  // 列定义
  const columns: { label: string, value: keyof DataType }[] = [
    { label: '省份', value: 'province' },
    { label: '城市', value: 'city' },
    { label: '省份车牌简称', value: 'code' },
    { label: '电车牌号前缀号', value: 'prefix' },
  ]
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="relative flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={run}>
          <div className="flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    {columns.map(({ label, value }) => (
                      <Table.Column key={value} isRowHeader={value === 'province'}>{label}</Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body renderEmptyState={() => <EmptyContent />}>
                    {data?.length
                      ? data.map((v, index) => (
                          <Table.Row key={index}>
                            {columns.map(({ value }) => (
                              <Table.Cell key={value}>{get(v, value, '--')}</Table.Cell>
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
          <Input
            aria-label="关键字"
            maxLength={50}
            placeholder="输入关键字，如粤A、广州市"
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            className="w-50"
          />
          <RefreshButton loading={loading} onPress={reFresh} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
