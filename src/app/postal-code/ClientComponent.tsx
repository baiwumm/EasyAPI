'use client'
import {
  Chip,
  Input,
  ListBox,
  Select,
  Table,
  toast,
} from '@heroui/react'
import { useRequest } from 'ahooks'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import CopyText from '@/components/CopyText'
import EmptyContent from '@/components/EmptyContent'
import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import TableLoading from '@/components/TableLoading'
import { POSTALCODE_TYPES } from '@/enums'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

interface PostalCode {
  province: string
  city: string
  area: string[]
  areaCode: string
  postCode: string
}

type Type = typeof POSTALCODE_TYPES.valueType

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const [type, setType] = useState<Type>(POSTALCODE_TYPES.CODE_TO_AREA)
  const [keyword, setKeyword] = useState('524200')

  // 实际请求参数
  const [params, setParams] = useState({ keyword, type })

  // 请求数据
  const { data, loading, error, run } = useRequest<PostalCode | PostalCode[], { keyword: string, type: number }[]>(
    async params => get(await getApiData(pathname, params), 'data'),
    {
      defaultParams: [params],
    },
  )

  // 请求数据
  const reload = () => {
    if (!keyword?.trim()) {
      toast.danger('参数 keyWord 必填')
      return
    }
    const newParams = { keyword, type }
    setParams(newParams)
    run(newParams)
  }

  // 列定义
  const columns: { label: string, value: keyof PostalCode }[] = [
    { label: '邮政编码', value: 'postCode' },
    { label: '省份', value: 'province' },
    { label: '城市', value: 'city' },
    { label: '区县', value: 'area' },
    { label: '电话区号', value: 'areaCode' },
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
                  {Array.isArray(data) || params.type === POSTALCODE_TYPES.AREA_TO_CODE
                    ? (
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
                      )
                    : (
                        <>
                          <Table.Header>
                            <Table.Column isRowHeader>字段</Table.Column>
                            <Table.Column>值</Table.Column>
                          </Table.Header>
                          <Table.Body renderEmptyState={() => <EmptyContent />}>
                            {columns.map(({ label, value }) => (
                              <Table.Row key={value}>
                                <Table.Cell>{label}</Table.Cell>
                                <Table.Cell>{value === 'postCode' ? <Chip color="accent" variant="soft">{get(data, 'postCode', '--')}</Chip> : get(data, value, '--')}</Table.Cell>
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
          <Select aria-label="邮政编码" placeholder="请选择" value={type} onChange={value => setType(value as Type)} className="w-50">
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {POSTALCODE_TYPES.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Input
            aria-label="关键字"
            maxLength={50}
            placeholder="请输入关键字"
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            className="w-50"
          />
          <RefreshButton loading={loading} text="查询" onPress={reload} />
          <CopyText content={Object.keys(data || {}).length > 0 ? JSON.stringify(data || {}, null, 2) : ''} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
