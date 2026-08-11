'use client'
import { ListBox, NumberField, Select } from '@heroui/react'
import { useRequest } from 'ahooks'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import RefreshButton from '@/components/RefreshButton'
import RequestContent from '@/components/RequestContent'
import { PERSON_SEXS, PERSON_SIZES } from '@/enums'
import { useCopy } from '@/hooks/use-copy'
import { get } from '@/lib/utils'
import { getApiData } from '@/services/common'

import type { FC } from 'react'

type PersonSex = typeof PERSON_SEXS.valueType
type PersonSize = typeof PERSON_SIZES.valueType

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const { copy } = useCopy()
  const pathname = usePathname()

  const [count, setCount] = useState(5)
  const [sex, setSex] = useState<PersonSex>(PERSON_SEXS.GENERIC)
  const [size, setSize] = useState<PersonSize>(PERSON_SIZES.SIZE_128)

  // 实际请求参数
  const [params, setParams] = useState({
    count,
    sex,
    size,
  })

  const { data = [], loading, error, run } = useRequest(
    async params => get(await getApiData(pathname, params), 'data', []),
    {
      defaultParams: [params],
    },
  )

  const handleGenerate = () => {
    const newParams = { count, sex, size }
    setParams(newParams)
    run(newParams)
  }

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>

      {/* 中间 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} loading={loading} loadingText="正在生成..." reFresh={handleGenerate}>
          <div className="flex items-center gap-4 flex-wrap">
            {data.map(url => (
              <Image
                key={url}
                alt={title}
                height={params.size}
                loading="eager"
                src={url}
                width={params.size}
                onClick={() => copy(url)}
                className="rounded-xl cursor-pointer"
              />
            ))}
          </div>
        </RequestContent>
      </div>

      {/* 底部 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select aria-label="性别" placeholder="性别" value={sex} onChange={value => setSex(value as PersonSex)} className="w-50">
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {PERSON_SEXS.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select aria-label="头像大小" placeholder="头像大小" value={size} onChange={value => setSize(value as PersonSize)} className="w-50">
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {PERSON_SIZES.items.map(({ value, label }) => (
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

          <RefreshButton text="重新生成" onPress={handleGenerate} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent
