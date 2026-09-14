"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { Copy, Shuffle } from "@gravity-ui/icons";
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
  Typography,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import tinycolor from "tinycolor2";

import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { useCopy } from "@/hooks/use-copy";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

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

interface DataType {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

// 随机颜色
function getRandomColor() {
  const color = tinycolor.random();

  return parseColor(color.toHexString());
}

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [color, setColor] = useState(getRandomColor);

  // 参数处理
  const params = useMemo(() => ({ color }), [color]);

  // 请求数据
  const { data, loading, error, mutate } = useSwrQuery(pathname, async () =>
    get(await getApiData(pathname, params), "data", {}),
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
          loading={loading}
          loadingText="正在转换..."
          reFresh={mutate}
        >
          <div className="flex justify-center items-center flex-wrap gap-2">
            {Object.keys((data as DataType) || {}).map((key) => {
              const color = (data || {})[key as keyof typeof data];

              return (
                <Chip
                  key={key}
                  className="cursor-pointer"
                  size="lg"
                  onClick={() => copy(color)}
                >
                  <Copy />
                  <Chip.Label>{color}</Chip.Label>
                </Chip>
              );
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
