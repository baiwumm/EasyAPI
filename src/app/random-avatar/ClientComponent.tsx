'use client'
import { Avatar, ListBox, NumberField, Select, Typography } from '@heroui/react'
import { useState } from 'react'

import RefreshButton from '@/components/RefreshButton'
import { AVATAR_STYLES } from '@/enums'

import type { FC } from 'react'
import type { ClientComponentProps } from '@/typings'

type Style = typeof AVATAR_STYLES.valueType

// 随机姓名池（本地常量，避免在客户端引入 @faker-js/faker 约 500KB 的 bundle）
const NAME_POOL = [
  // 中文名
  '张伟',
  '王芳',
  '李娜',
  '刘洋',
  '陈静',
  '杨帆',
  '赵磊',
  '黄敏',
  '周杰',
  '吴婷',
  '徐强',
  '孙丽',
  '马超',
  '朱琳',
  '胡军',
  '郭涛',
  '何雪',
  '高远',
  '林欣',
  '罗成',
  '郑爽',
  '梁博',
  '谢宁',
  '宋佳',
  '唐明',
  '许晴',
  '韩雪',
  '冯宇',
  '邓超',
  '曹阳',
  // 英文名
  'Alice',
  'Bob',
  'Carol',
  'David',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
  'Ivy',
  'Jack',
  'Kevin',
  'Lily',
  'Mike',
  'Nina',
  'Oliver',
  'Pam',
  'Quinn',
  'Ryan',
  'Sara',
  'Tom',
]

function generateUsers(length = 5) {
  return Array.from({ length }).map(() => ({
    name: NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)]!,
  }))
}

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const [style, setStyle] = useState<Style>(AVATAR_STYLES.RANDOM)
  const [users, setUsers] = useState(generateUsers)
  const [count, setCount] = useState(5) // 生成的数量
  const [size, setSize] = useState(128) // 生成的大小

  const regenerate = () => {
    setUsers(generateUsers(count))
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <Typography type="h1" className="text-2xl font-black tracking-normal">{title}</Typography>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-4 flex-wrap">
            {users.map((user, index) => {
              return (
                <Avatar key={index} size="lg">
                  <Avatar.Image
                    alt={user.name}
                    src={`/api/random-avatar?seed=${user.name}&style=${style}&size=${size}`}
                  />
                  <Avatar.Fallback>
                    {user.name.slice(0, 1)}
                  </Avatar.Fallback>
                </Avatar>
              )
            })}
          </div>
        </div>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            aria-label="头像风格"
            placeholder="头像风格"
            value={style}
            onChange={value => setStyle(value as Style)}
            className="w-50"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {AVATAR_STYLES.items.map(({ value, label }) => (
                  <ListBox.Item
                    key={value}
                    id={value}
                    textValue={label}
                  >
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <NumberField aria-label="生成的数量" maxValue={50} minValue={1} value={count} onChange={setCount}>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField aria-label="生成的大小" maxValue={512} minValue={16} value={size} onChange={setSize}>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton text="重新生成" onPress={regenerate} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
