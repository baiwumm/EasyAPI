'use client'
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Button, ColorSwatch, ListBox, NumberField, Select, Spinner } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import tinycolor from "tinycolor2";

import AlertContent from '@/components/AlertContent';
import LoadingContent from '@/components/LoadingContent';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

type Format = "hex" | "rgb" | "hsl" | "hsv" | "all";

type Color = string | {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
};

const formatOptions: { value: Format, label: string }[] = [
  { value: "all", label: "全部" },
  { value: "hex", label: "Hex" },
  { value: "rgb", label: "Rgb" },
  { value: "hsl", label: "Hsl" },
  { value: "hsv", label: "Hsv" },
];

export default function ClientComponent() {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [format, setFormat] = useState<Format>("all"); // 颜色格式
  const [count, setCount] = useState(10); // 生成的数量

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ format, count }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ format, count });
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
        {data.map((v: Record<keyof Color, string>) => {
          const rawColor = format === 'all' ? v.hex : v;
          const displayColor = format === "hsv" ? tinycolor(rawColor).toHexString() : rawColor;
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
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">随机颜色</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            className="w-50"
            placeholder="请选择颜色格式"
            value={format}
            onChange={(value) => setFormat(value as Format)}
            aria-label="颜色格式"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {formatOptions.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
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