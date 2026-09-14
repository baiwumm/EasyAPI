"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { Shuffle } from "@gravity-ui/icons";
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
  parseColor,
  Typography,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import CopyChip from "@/components/CopyChip";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { colorPresets, getRandomColor } from "@/lib/color";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

interface DataType {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  // 初始值固定，避免 SSR/CSR 各随机一次导致 hydration mismatch；点击"随机"再洗牌
  const [color, setColor] = useState(() => parseColor("#3b82f6"));

  // 参数处理
  const params = useMemo(() => ({ color }), [color]);

  // 请求数据
  const { data, isLoading, loading, error, mutate } = useSwrQuery(
    pathname,
    async () => get(await getApiData(pathname, params), "data", {}),
  );

  const shuffleColor = () => {
    setColor(getRandomColor());
  };

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <Typography className="text-2xl font-black tracking-normal" type="h1">
          {title}
        </Typography>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent
          error={error}
          loading={isLoading}
          loadingText="正在转换..."
          reFresh={mutate}
        >
          <div className="flex justify-center items-center flex-wrap gap-2">
            {Object.keys((data as DataType) || {}).map((key) => {
              const color = (data || {})[key as keyof typeof data];

              return <CopyChip key={key} value={color} />;
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
                <ColorSlider
                  aria-label="Hue slider"
                  channel="hue"
                  className="flex-1"
                  colorSpace="hsb"
                >
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
          <RefreshButton
            loading={loading}
            text="转换"
            onPress={() => mutate()}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
