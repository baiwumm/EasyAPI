'use client'
import { ArrowsRotateLeft, CircleCheck, CircleXmark } from '@gravity-ui/icons';
import { Button, ColorSwatch, type Key, ListBox, NumberField, Select, Spinner, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import useClipboard from '@/hooks/use-clipboard';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const formatOptions = [
  { value: "all", label: "全部" },
  { value: "hex", label: "Hex" },
  { value: "rgb", label: "Rgb" },
  { value: "hsl", label: "Hsl" },
  { value: "hsv", label: "Hsv" },
];

function hsvStringToHex(hsv: string): string {
  const HSV_REGEX = /^hsv\(\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)%?\s*,\s*([0-9]+(?:\.[0-9]+)?)%?\s*\)$/i;
  // 解析 "hsv(h, s%, v%)"
  const match = hsv.match(HSV_REGEX);
  if (!match) {
    return "#000000"; // 默认返回黑色
  }

  const [, hStr, sStr, vStr] = match;
  const h = parseFloat(hStr as string);
  let s = parseFloat(sStr as string);
  let v = parseFloat(vStr as string);

  // 归一化
  s /= 100;
  v /= 100;

  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0,
    g = 0,
    b = 0;

  if (hh >= 0 && hh < 1) [r, g, b] = [c, x, 0];
  else if (hh >= 1 && hh < 2) [r, g, b] = [x, c, 0];
  else if (hh >= 2 && hh < 3) [r, g, b] = [0, c, x];
  else if (hh >= 3 && hh < 4) [r, g, b] = [0, x, c];
  else if (hh >= 4 && hh < 5) [r, g, b] = [x, 0, c];
  else if (hh >= 5 && hh < 6) [r, g, b] = [c, 0, x];

  const m = v - c;
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
    .toString(16)
    .padStart(2, "0")}`.toUpperCase();
}

// 获取颜色字符串
const getColorString = (v) => v.hex || v.string || v;

export default function ClientComponent() {
  const pathname = usePathname();
  const { copy, isSupported } = useClipboard();
  const [format, setFormat] = useState<Key | null>("all"); // 颜色格式
  const [count, setCount] = useState(10); // 生成的数量
  const [isHsv, setIsHsv] = useState(false);

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [{ format, count }],
    onSuccess: () => {
      setIsHsv(format === "hsv");
    },
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ format, count });
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
        {data.map((v) => {
          const color = isHsv ? hsvStringToHex(getColorString(v)) : getColorString(v);
          return (
            <ColorSwatch
              key={color}
              aria-label={color}
              color={color}
              onClick={() => handleCopy(getColorString(v))}
              className="cursor-pointer"
              style={() => ({
                boxShadow: `0 0 10px 2px ${color}`,
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
            onChange={(value) => setFormat(value)}
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