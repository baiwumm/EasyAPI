"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { ArrowDownToSquare } from "@gravity-ui/icons";
import { Button, Input, NumberField, toast, Typography } from "@heroui/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import EnumSelect from "@/components/EnumSelect";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { QRCODE_FORMATS } from "@/enums";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { useRequireParam } from "@/hooks/use-require-param";

type Format = typeof QRCODE_FORMATS.valueType;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const [format, setFormat] = useState<Format>(QRCODE_FORMATS.PNG); // 生成格式
  const [size, setSize] = useState(256); // 二维码大小
  const [text, setText] = useState(process.env.NEXT_PUBLIC_APP_NAME!);
  const requireParam = useRequireParam();

  // 参数处理
  const params = useMemo(
    () => ({ format, size: String(size), text }),
    [format, size, text],
  );

  // 生成、错误兜底、blob 回收与下载（与 barcode 共享）
  const { imgSrc, downloadUrl, loading, error, trigger, downloadImage } =
    useImageGeneration({
      params,
      svgResponse: format === QRCODE_FORMATS.SVG,
      jsonSuccessData: format === QRCODE_FORMATS.DATAURL,
    });

  // 请求数据
  const reFresh = () => {
    if (!requireParam(text)) {
      return;
    }
    if (text.length > 2000) {
      toast.danger("参数 text 长度不能超过 2000 个字符");

      return;
    }
    trigger();
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
          reFresh={reFresh}
        >
          <div className="flex justify-center items-center">
            <Image
              alt={text || "二维码"}
              height={size}
              src={imgSrc}
              width={size}
            />
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <EnumSelect
            aria-label="生成格式"
            className="w-50"
            items={QRCODE_FORMATS.items}
            placeholder="请选择生成格式"
            value={format}
            onChange={(value) => setFormat(value as Format)}
          />
          <NumberField
            aria-label="二维码大小"
            maxValue={1000}
            minValue={64}
            value={size}
            onChange={setSize}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <Input
            aria-label="二维码内容"
            className="w-50"
            placeholder="二维码内容"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                reFresh();
              }
            }}
          />
          <RefreshButton loading={loading} text="生成" onPress={reFresh} />
          <Button
            isDisabled={!downloadUrl || loading}
            size="sm"
            variant="tertiary"
            onPress={() =>
              downloadImage(`qrcode.${format === "dataurl" ? "png" : format}`)
            }
          >
            <ArrowDownToSquare />
            下载
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
