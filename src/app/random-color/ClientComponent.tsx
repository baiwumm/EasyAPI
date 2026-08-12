'use client'
import { ColorSwatch, ListBox, NumberField, Select, Typography } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import tinycolor from 'tinycolor2'

import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import { RANDOM_COLOR_FORMATS } from '@/enums'
import { useCopy } from '@/hooks/use-copy'
import { useRequest } from '@/hooks/use-request'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

type Color = string | {
  hex: string
  rgb: string
  hsl: string
  hsv: string
}

type Format = typeof RANDOM_COLOR_FORMATS.valueType

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname()
  const { copy } = useCopy()
  const [format, setFormat] = useState<Format>(RANDOM_COLOR_FORMATS.ALL) // 颜色格式
  const [count, setCount] = useState(10) // 生成的数量

  // 参数处理
  const params = useMemo(() => ({ format, count }), [format, count])

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
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
        <RequestContent error={error} loading={loading} loadingText="正在生成..." reFresh={run}>
          <div className="flex justify-center items-center flex-wrap gap-2">
            {data.map((v: Color) => {
              const rawColor = typeof v === 'string' ? v : v.hex
              const displayColor = tinycolor(rawColor).toHexString()
              return (
                <ColorSwatch
                  key={displayColor}
                  aria-label={displayColor}
                  color={displayColor}
                  onClick={() => copy(rawColor)}
                  className="cursor-pointer"
                  style={() => ({
                    boxShadow: `0 0 10px 2px ${displayColor}`,
                  })}
                />
              )
            })}
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            aria-label="颜色格式"
            placeholder="请选择颜色格式"
            value={format}
            onChange={value => setFormat(value as Format)}
            className="w-50"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {RANDOM_COLOR_FORMATS.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
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
          <RefreshButton loading={loading} text="生成" onPress={run} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
