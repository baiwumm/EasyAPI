'use client'
import { fakerZH_CN as faker } from "@faker-js/faker";
import { Avatar, ListBox, NumberField, Select } from '@heroui/react';
import { useState } from 'react';

import RefreshButton from '@/components/RefreshButton';
import { AVATAR_STYLES } from '@/enums';

function generateUsers(length = 5) {
  return Array.from({ length }).map(() => ({
    name: faker.person.fullName(),
  }));
}

export default function ClientComponent() {
  const [style, setStyle] = useState<typeof AVATAR_STYLES.valueType>(AVATAR_STYLES.RANDOM);
  const [users, setUsers] = useState(generateUsers);
  const [count, setCount] = useState(5); // 生成的数量
  const [size, setSize] = useState(128); // 生成的大小

  const regenerate = () => {
    setUsers(generateUsers(count));
  };
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">随机头像</h1>
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
            className="w-50"
            placeholder="头像风格"
            aria-label="头像风格"
            value={style}
            onChange={(value) => setStyle(value as typeof AVATAR_STYLES.valueType)}
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
          <NumberField minValue={1} maxValue={50} value={count} onChange={setCount} aria-label="生成的数量">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField minValue={16} maxValue={512} value={size} onChange={setSize} aria-label="生成的大小">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton text='重新生成' onPress={regenerate} />
        </div>
      </div>
    </div>
  )
}