'use client'
import { ArrowsRotateLeft, Copy, Shuffle } from '@gravity-ui/icons';
import {
  Button,
  Chip,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
  parseColor,
  Spinner,
} from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import tinycolor from "tinycolor2";

import AlertContent from '@/components/AlertContent';
import LoadingContent from '@/components/LoadingContent';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const colorPresets = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
];

export default function ClientComponent() {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [color, setColor] = useState(parseColor("#2ecc40"));

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', {}), {
    defaultParams: [{ color }]
  },
  );

  const shuffleColor = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSaturation = 50 + Math.floor(Math.random() * 50); // 50-100%
    const randomLightness = 40 + Math.floor(Math.random() * 30); // 40-70%
    setColor(parseColor(`hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`));
  };

  // 请求数据
  const reFresh = () => {
    run({ color });
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
      return <LoadingContent text='正在转换...' />
    }
    return (
      <div className="flex justify-center items-center flex-wrap gap-2">
        {Object.keys(data).map(key => {
          const color = (data as Record<string, string>)[key];
          return (
            <Chip
              key={key}
              className="cursor-pointer"
              onClick={() => copy(color)}
              style={{
                backgroundColor: tinycolor(color).toHexString(),
              }}
            >
              <Copy className="text-white mix-blend-difference" />
              <Chip.Label className="text-white mix-blend-difference">{color}</Chip.Label>
            </Chip>
          )
        })}
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">颜色转换</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ColorPicker value={color} onChange={setColor}>
            <ColorPicker.Trigger>
              <ColorSwatch size="lg" />
              <Label>{color.toString("hex")}</Label>
            </ColorPicker.Trigger>
            <ColorPicker.Popover className="gap-2">
              <ColorSwatchPicker className="justify-center pt-2" size="xs">
                {colorPresets.map((preset) => (
                  <ColorSwatchPicker.Item key={preset} color={preset}>
                    <ColorSwatchPicker.Swatch />
                  </ColorSwatchPicker.Item>
                ))}
              </ColorSwatchPicker>
              <ColorArea
                aria-label="Color area"
                className="max-w-full"
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
              >
                <ColorArea.Thumb />
              </ColorArea>
              <div className="flex items-center gap-2 px-1">
                <ColorSlider aria-label="Hue slider" channel="hue" className="flex-1" colorSpace="hsb">
                  <ColorSlider.Track>
                    <ColorSlider.Thumb />
                  </ColorSlider.Track>
                </ColorSlider>
                <Button
                  isIconOnly
                  aria-label="Shuffle color"
                  size="sm"
                  variant="tertiary"
                  onPress={shuffleColor}
                >
                  <Shuffle />
                </Button>
              </div>
              <ColorField aria-label="Color field">
                <ColorField.Group variant="secondary">
                  <ColorField.Prefix>
                    <ColorSwatch size="xs" />
                  </ColorField.Prefix>
                  <ColorField.Input />
                </ColorField.Group>
              </ColorField>
            </ColorPicker.Popover>
          </ColorPicker>
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                转换
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}