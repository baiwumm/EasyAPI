'use client'
import { ArrowsRotateLeft, CircleCheck, CircleXmark, Copy } from '@gravity-ui/icons';
import { Button, Chip, Input, type Key, ListBox, NumberField, Select, Spinner, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import useClipboard from '@/hooks/use-clipboard';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const typeOptions = [
  { value: "number", label: "数字" },
  { value: "lower", label: "小写字母" },
  { value: "upper", label: "大写字母" },
  { value: "symbol", label: "特殊字符" },
];

export default function ClientComponent() {
  const pathname = usePathname();
  const { copy, isSupported } = useClipboard();
  const [types, setTypes] = useState<Key[]>(["number", "lower"]); // 类型组合
  const [length, setLength] = useState(16); // 字符串长度
  const [count, setCount] = useState(10); // 生成的数量
  const [exclude, setExclude] = useState(''); // 需要排除的字符

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ type: Array.from(types).join(','), length, count, exclude }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ type: Array.from(types).join(','), length, count, exclude });
  }

  // 点击复制回调
  const handleCopy = async (content: string) => {
    // 无内容
    if (!content) {
      toast.danger('复制失败，缺少内容!', {
        indicator: <CircleXmark />,
      })
      return
    }

    // 浏览器不支持
    if (!isSupported) {
      toast.danger('复制失败，当前浏览器不支持！', {
        indicator: <CircleXmark />,
      })
      return
    }

    try {
      await copy(content, content)
      toast.success('复制成功', {
        indicator: <CircleCheck />,
      })
    } catch {
      toast.danger('复制失败，请手动复制!', {
        indicator: <CircleXmark />,
      })
    }
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
      return (
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-sm text-muted font-bold">正在生成...</span>
        </div>
      )
    }
    return (
      <div className="flex justify-center items-center flex-wrap gap-2">
        {data.map((v, i) => (
          <Chip
            key={v}
            color='accent'
            variant='soft'
            onClick={() => handleCopy(v)}
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
            selectionMode="multiple"
            className="w-50"
            placeholder="请选择类型组合"
            value={types}
            onChange={(keys) => setTypes(keys)}
            aria-label="类型组合"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {typeOptions.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <NumberField minValue={1} maxValue={100} value={length} onChange={setLength} aria-label="字符串长度">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField minValue={1} maxValue={50} value={count} onChange={setCount} aria-label="生成的数量">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <Input aria-label="排除的字符" className="w-50" placeholder="请输入需要排除的字符" value={exclude} onChange={(event) => setExclude(event.target.value)} />
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