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

import CopyText from "@/components/CopyText";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { colorPresets, getRandomColor } from "@/lib/color";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useCopy } from "@/hooks/use-copy";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const { copy } = useCopy();
  // 初始值固定，避免 SSR/CSR 各随机一次导致 hydration mismatch；点击"随机"再洗牌
  const [color, setColor] = useState(() => parseColor("#3b82f6"));

  // 参数处理
  const params = useMemo(() => ({ color }), [color]);

  // 实际请求参数（已提交模式：点击生成才更新，变化自动重查）
  const { params: queryParams, commit } = useCommittedParams(params);

  // 请求数据：key 含已提交参数，提交后参数变化自动请求
  const { data, loading, error, mutate } = useSwrQuery(
    [pathname, queryParams],
    async () =>
      get(await getApiData(pathname, queryParams), "data.palette", {}),
  );

  const shuffleColor = () => {
    setColor(getRandomColor());
  };

  // 提交生成：参数没变时 key 不变，SWR 不会发请求 → 手动刷新
  const handleGenerate = () => {
    if (!commit(params)) {
      mutate();
    }
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
          loadingText="正在生成..."
          reFresh={mutate}
        >
          <div className="flex justify-center items-center flex-wrap gap-2">
            {Object.keys((data as Record<string, string>) || {}).map((key) => {
              const color = (data || {})[key as keyof typeof data];

              return (
                <ColorSwatch
                  key={key}
                  aria-label={color}
                  className="cursor-pointer"
                  color={color}
                  size="xl"
                  style={() => ({
                    boxShadow: `0 0 20px 2px ${color}`,
                  })}
                  onClick={() => copy(color)}
                />
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
            text="生成"
            onPress={handleGenerate}
          />
          <CopyText content={JSON.stringify(data, null, 2)} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
