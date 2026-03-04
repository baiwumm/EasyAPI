'use client'
import { Input, toast } from '@heroui/react';
import { useState } from 'react';

import JsonContent from '@/components/JsonContent';

export default function ClientComponent() {
  const [ip, setIp] = useState('183.14.31.212');

  // 请求数据
  const onRefresh = () => {
    if (!ip?.trim()) {
      toast.danger("IP 地址不能为空");
      return false;
    }
    return true
  }
  return (
    <JsonContent title="IP 归属地查询" params={{ ip }} onRefresh={onRefresh}>
      <Input value={ip} onChange={(event) => setIp(event.target.value)} aria-label="IP 地址" placeholder='请输入 IP 地址' className="w-50" />
    </JsonContent>
  )
}