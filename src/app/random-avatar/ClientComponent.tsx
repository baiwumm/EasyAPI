'use client'
import { fakerZH_CN as faker } from "@faker-js/faker";
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Avatar, Button, ListBox, Select, Spinner } from '@heroui/react';
import { useState } from 'react';

import { AVATAR_STYLES } from '@/enums';

function generateUsers() {
  return Array.from({ length: 5 }).map(() => ({
    name: faker.person.fullName(),
  }));
}

export default function ClientComponent() {
  const [style, setStyle] = useState<typeof AVATAR_STYLES.valueType>(AVATAR_STYLES.RANDOM);
  const [users, setUsers] = useState(generateUsers);

  const regenerate = () => {
    setUsers(generateUsers());
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
                    src={`/api/random-avatar?seed=${user.name}&style=${style}`}
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
          <Button size='sm' onPress={regenerate} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                重新生成
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}