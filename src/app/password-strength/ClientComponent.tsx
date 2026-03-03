'use client'
import { Input, toast } from '@heroui/react';
import { useState } from 'react';

import JsonContent from '@/components/JsonContent';

export default function ClientComponent() {
  const [password, setPassword] = useState('abc123456');

  // 请求数据
  const onRefresh = () => {
    if (!password?.trim()) {
      toast.danger("参数 password 必填");
      return false;
    }
    if (password.length > 128) {
      toast.danger("参数 password 长度不能超过 128 个字符");
      return false;
    }
    return true
  }
  return (
    <JsonContent title="密码强度检测" searchText='检测' params={{ password }} onRefresh={onRefresh}>
      <Input value={password} onChange={(event) => setPassword(event.target.value)} aria-label="密码" placeholder='请输入密码' className="w-50" />
    </JsonContent>
  )
}