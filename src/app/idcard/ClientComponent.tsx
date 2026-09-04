'use client'
import { Chip, Input, toast } from '@heroui/react'
import dayjs from 'dayjs'
import idCard from 'idcard'
import { useState } from 'react'

import JsonContent from '@/components/JsonContent'

import type { GetColumnsFn } from '@/components/JsonContent'
import type { FC } from 'react'
import type { ClientComponentProps } from '@/typings'

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const [id, setId] = useState('510101199502152091')

  // 请求数据
  const onRefresh = () => {
    if (!id?.trim() || !idCard.verify(id)) {
      toast.danger('身份证不合法！')
      return false
    }
    return true
  }

  const getColumns: GetColumnsFn<idCard.IdCardSuccessResult & { birthday: string }> = (data) => {
    const { gender, birthday, age, cardText, constellation, address } = data || {}
    return [
      { label: '性别', children: <Chip color="accent" variant="soft">{{ M: '男', F: '女' }[gender] || '--'}</Chip> },
      { label: '生日', children: dayjs(String(birthday)).format('YYYY年M月D日') },
      { label: '年龄', children: <Chip variant="soft">{age}</Chip> },
      { label: '身份证类型', children: cardText },
      { label: '星座', children: `${constellation}座` },
      { label: '地址', children: address },
    ]
  }
  return (
    <JsonContent title={title} getColumns={getColumns} params={{ id }} onRefresh={onRefresh}>
      <Input aria-label="身份证" placeholder="请输入身份证号" value={id} onChange={event => setId(event.target.value)} className="w-50" />
    </JsonContent>
  )
}
export default ClientComponent
