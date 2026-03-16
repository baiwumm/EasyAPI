'use client'
import { Shuffle } from '@gravity-ui/icons';
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
  parseColor
} from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, useMemo, useState } from 'react';
import tinycolor from "tinycolor2";

import CopyText from '@/components/CopyText';
import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const colorPresets = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e"];

// 随机颜色
const getRandomColor = () => {
  const color = tinycolor.random();
  return parseColor(color.toHexString());
};

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [color, setColor] = useState(getRandomColor);

  // 参数处理
  const params = useMemo(() => ({ color }), [color]);

  // 请求数据
  const { data, loading, error, run } = useRequest(
    async () => get(await getApiData(pathname, params), 'data.palette', {})
  );

  const shuffleColor = () => {
    setColor(getRandomColor());
  };

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={run} loading={loading} loadingText='正在生成...'>
          <div className="flex justify-center items-center flex-wrap gap-2">
            {Object.keys(data as Record<string, string> || {}).map(key => {
              const color = (data || {})[key as keyof typeof data];
              return (
                <ColorSwatch
                  key={key}
                  aria-label={color}
                  color={color}
                  size='xl'
                  onClick={() => copy(color)}
                  className="cursor-pointer"
                  style={() => ({
                    boxShadow: `0 0 20px 2px ${color}`,
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
          <RefreshButton text='生成' loading={loading} onPress={run} />
          <CopyText content={JSON.stringify(data, null, 2)} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent;