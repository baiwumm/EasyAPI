'use client'
import { Chip, Input } from '@heroui/react';
import { useState } from 'react';

import JsonContent, { type GetColumnsFn } from '@/components/JsonContent';

export default function ClientComponent() {
  const [ip, setIp] = useState('');

  const getColumns: GetColumnsFn<Record<string, any>> = (data) => {
    const { query, isp, country, regionName, city, lon, lat } = data || {};
    return [
      { label: 'IP地址', children: <Chip color='accent' variant='soft'>{query}</Chip> },
      { label: '网络服务商', children: isp },
      { label: '归属地', children: `${country}${regionName}${city}` },
      { label: '经度', children: lon },
      { label: '纬度', children: lat }
    ]
  }
  return (
    <JsonContent title="IP 归属地查询" params={{ ip }} onRefresh={() => true} getColumns={getColumns}>
      <Input value={ip} onChange={(event) => setIp(event.target.value)} aria-label="IP 地址" placeholder='默认取本地 IP 地址' className="w-50" />
    </JsonContent>
  )
}