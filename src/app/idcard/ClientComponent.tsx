'use client'
import { Input, toast } from '@heroui/react';
import idCard from 'idcard';
import { useState } from 'react';

import JsonContent from '@/components/JsonContent';

export default function ClientComponent() {
  const [id, setId] = useState('510101199502152091');

  // 请求数据
  const onRefresh = () => {
    if (!id?.trim() || !idCard.verify(id)) {
      toast.danger("身份证不合法！");
      return false;
    }
    return true
  }
  return (
    <JsonContent title="身份证信息查询" params={{ id }} onRefresh={onRefresh}>
      <Input value={id} onChange={(event) => setId(event.target.value)} aria-label="身份证" placeholder='请输入身份证号' className="w-50" />
    </JsonContent>
  )
}