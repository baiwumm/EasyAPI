'use client'
import { Input, ListBox, Select, toast } from '@heroui/react';
import { useState } from 'react';

import JsonContent from '@/components/JsonContent';

export default function ClientComponent() {
  const [type, setType] = useState(1);
  const [keyword, setKeyword] = useState('524200');

  // 请求数据
  const onRefresh = () => {
    if (!keyword?.trim()) {
      toast.danger("参数 keyWord 必填");
      return false;
    }
    return true
  }
  return (
    <JsonContent title="邮政编码查询" params={{ keyword, type }} onRefresh={onRefresh}>
      <Select className="w-50" placeholder="请选择" value={type} onChange={(value) => setType(value as number)}>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id={1} textValue="邮编查地区">
              邮编查地区
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id={2} textValue="地区查邮编">
              地区查邮编
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
      <Input
        value={keyword}
        maxLength={50}
        onChange={(event) => setKeyword(event.target.value)}
        aria-label="关键字"
        placeholder='请输入关键字'
        className="w-50"
      />
    </JsonContent>
  )
}