'use client'
import { ArrowsRotateLeft, Copy } from '@gravity-ui/icons';
import { Button, Chip, Description, Input, Label, ListBox, NumberField, Select, Spinner, TextField } from '@heroui/react';
import { useRequest } from 'ahooks';
import { type Options } from 'crypto-random-string'
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import LoadingContent from '@/components/LoadingContent';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const RANDOM_STRING_TYPE_OPTIONS = [
  {
    label: '字母 + 数字',
    value: 'alphanumeric',
    description: '最常用的随机字符串类型'
  },
  {
    label: 'URL 安全 Base64',
    value: 'url-safe',
    description: '适用于 URL，不包含 + /'
  },
  {
    label: '纯数字（0-9）',
    value: 'numeric',
    description: '常用于验证码、短信码'
  },
  {
    label: '易区分字符',
    value: 'distinguishable',
    description: '去除 0/O、1/l 等易混淆字符'
  },
  {
    label: '十六进制（0-9 a-f）',
    value: 'hex',
    description: '常用于哈希、Token、ID'
  },
  {
    label: 'Base64 编码',
    value: 'base64',
    description: '包含大小写字母、数字、+ /'
  },
  {
    label: '可打印 ASCII 字符',
    value: 'ascii-printable',
    description: '包含字母、数字、符号、标点'
  }
]

export default function ClientComponent() {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [type, setType] = useState<Options['type']>('alphanumeric');
  const [length, setLength] = useState(16); // 字符串长度
  const [count, setCount] = useState(10); // 生成的数量
  const [characters, setCharacters] = useState(''); // 自定义字符集

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ type, length, count, characters }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ type, length, count, characters });
  }

  // 渲染内容
  const renderContent = () => {
    if (error) {
      return (
        <AlertContent
          status="danger"
          title="请求失败"
          description="服务暂时不可用，请稍后重试。"
          actionText="重新加载"
          buttonVariant="danger"
          buttonAction={reFresh}
        />
      )
    }
    if (loading) {
      return <LoadingContent text='正在生成...' />
    }
    return (
      <div className="flex justify-center items-center flex-wrap gap-2">
        {data.map((v) => (
          <Chip
            key={v}
            size='lg'
            color='accent'
            variant='soft'
            onClick={() => copy(v)}
            className="cursor-pointer"
          >
            <Copy />
            <Chip.Label>{v}</Chip.Label>
          </Chip>
        ))}
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">随机字符串</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            className="w-60"
            placeholder="请选择类型"
            value={type}
            onChange={(val) => setType(val as Options['type'])}
            aria-label="类型组合"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {RANDOM_STRING_TYPE_OPTIONS.map(({ value, label, description }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    <div className="flex flex-col">
                      <Label>{label}</Label>
                      <Description>{description}</Description>
                    </div>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <NumberField minValue={1} maxValue={100} value={length} onChange={setLength} aria-label="字符串长度">
            <Description>字符串长度</Description>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField minValue={1} maxValue={50} value={count} onChange={setCount} aria-label="生成的数量">
            <Description>生成的数量</Description>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <TextField>
            <Description>会忽略 type</Description>
            <Input
              aria-label="自定义字符集"
              maxLength={65536}
              className="w-50"
              placeholder="自定义字符集"
              value={characters}
              onChange={(event) => setCharacters(event.target.value)}
            />
          </TextField>
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                生成
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}