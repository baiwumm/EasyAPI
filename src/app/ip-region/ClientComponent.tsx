'use client'
import { Chip, Input } from '@heroui/react'
import { useState } from 'react'

import JsonContent from '@/components/JsonContent'

import type { GetColumnsFn } from '@/components/JsonContent'
import type { FC } from 'react'

interface DataType {
  query: string
  isp: string
  country: string
  city: string
  regionName: string
  lat: number
  lon: number
}

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const [ip, setIp] = useState('')

  const getColumns: GetColumnsFn<DataType> = (data) => {
    const { query, isp, country, regionName, city, lon, lat } = data || {}
    return [
      { label: 'IP地址', children: <Chip color="accent" variant="soft">{query}</Chip> },
      { label: '网络服务商', children: isp },
      { label: '归属地', children: `${country}${regionName}${city}` },
      { label: '经度', children: lon },
      { label: '纬度', children: lat },
    ]
  }
  return (
    <JsonContent title={title} getColumns={getColumns} params={{ ip }} onRefresh={() => true}>
      <Input aria-label="IP 地址" placeholder="默认取本地 IP 地址" value={ip} onChange={event => setIp(event.target.value)} className="w-50" />
    </JsonContent>
  )
}
export default ClientComponent
