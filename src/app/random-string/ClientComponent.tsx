'use client'
import { Copy } from '@gravity-ui/icons'
import {
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  TextField,
  Typography,
} from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import { RANDOM_STRING_TYPES } from '@/enums'
import { useCopy } from '@/hooks/use-copy'
import { useSwrQuery } from '@/hooks/use-swr'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { Options } from 'crypto-random-string'
import type { FC } from 'react'
import type { ClientComponentProps } from '@/typings'

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const { copy } = useCopy()
  const [type, setType] = useState<Options['type']>(RANDOM_STRING_TYPES.ALPHANUMERIC)
  const [length, setLength] = useState(16) // 字符串长度
  const [count, setCount] = useState(10) // 生成的数量
  const [characters, setCharacters] = useState('') // 自定义字符集

  // 参数处理
  const params = useMemo(() => ({ type, length, count, characters }), [type, length, count, characters])

  // 请求数据
  const { data = [], loading, error, mutate } = useSwrQuery(
    pathname,
    async () => get(await getApiData(pathname, params), 'data', []),
  )
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <Typography type="h1" className="text-2xl font-black tracking-normal">{title}</Typography>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} loading={loading} loadingText="正在生成..." reFresh={mutate}>
          <div className="flex justify-center items-center flex-wrap gap-2">
            {data.map(v => (
              <Chip
                key={v}
                color="accent"
                size="lg"
                variant="soft"
                onClick={() => copy(v)}
                className="cursor-pointer"
              >
                <Copy />
                <Chip.Label>{v}</Chip.Label>
              </Chip>
            ))}
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-end gap-2 flex-wrap">
          <Select
            aria-label="类型组合"
            placeholder="请选择类型"
            value={type}
            onChange={val => setType(val as Options['type'])}
            className="w-60"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {RANDOM_STRING_TYPES.items.map(({ value, label, raw }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    <div className="flex flex-col">
                      <Label>{label}</Label>
                      <Description>{raw.description}</Description>
                    </div>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <NumberField aria-label="字符串长度" maxValue={100} minValue={1} value={length} onChange={setLength}>
            <Description>字符串长度</Description>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField aria-label="生成的数量" maxValue={50} minValue={1} value={count} onChange={setCount}>
            <Description>生成的数量</Description>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <TextField aria-label="自定义字符集">
            <Description>会忽略 type</Description>
            <Input
              aria-label="自定义字符集"
              maxLength={65536}
              placeholder="自定义字符集"
              value={characters}
              onChange={event => setCharacters(event.target.value)}
              className="w-50"
            />
          </TextField>
          <RefreshButton loading={loading} text="生成" onPress={() => mutate()} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
