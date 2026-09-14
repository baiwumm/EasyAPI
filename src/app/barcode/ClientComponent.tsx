"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { ArrowDownToSquare } from "@gravity-ui/icons";
import { Button, Description, Input, Typography } from "@heroui/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import EnumSelect from "@/components/EnumSelect";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { BARCODE_FORMATS, BARCODE_TYPES } from "@/enums";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { useRequireParam } from "@/hooks/use-require-param";

type BarcodeFormats = typeof BARCODE_FORMATS.valueType;
type BarCodeTypes = typeof BARCODE_TYPES.valueType;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const [text, setText] = useState(process.env.NEXT_PUBLIC_APP_NAME!); // 图形码内容
  const [type, setType] = useState<BarCodeTypes>(BARCODE_TYPES.SVG); // 生成格式
  const [format, setFormat] = useState<BarcodeFormats>(BARCODE_FORMATS.CODE128); // 条形码格式
  const requireParam = useRequireParam();

  // 参数处理
  const params = useMemo(() => ({ type, format, text }), [type, format, text]);

  // 生成、错误兜底、blob 回收与下载（与 qrcode 共享）
  const { imgSrc, downloadUrl, loading, error, trigger, downloadImage } =
    useImageGeneration({
      params,
      svgResponse: type === BARCODE_TYPES.SVG,
      jsonSuccessData: false,
    });

  // 请求数据
  const reFresh = () => {
    if (!requireParam(text)) {
      return;
    }
    trigger();
  };

  //  format 配置
  const formatRaw = useMemo(() => BARCODE_FORMATS.raw(format), [format]);

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
            <div className="relative flex flex-col gap-2 items-center min-h-60">
              {imgSrc ? (
                <>
                  <Image
                    unoptimized
                    alt={text || "条形码"}
                    className="max-w-125 h-auto"
                    height={592}
                    src={imgSrc}
                    width={1108}
                  />
                  <Description className="text-danger">
                    {formatRaw.description}
                  </Description>
                  {formatRaw.hint && (
                    <Description className="text-danger">
                      提示:
                      {formatRaw.hint}
                    </Description>
                  )}
                  {formatRaw.charset && (
                    <Description className="text-danger">
                      允许字符:
                      {formatRaw.charset}
                    </Description>
                  )}
                  {formatRaw.example && (
                    <Description className="text-danger">
                      示例:
                      {formatRaw.example}
                    </Description>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <EnumSelect
            aria-label="条形码格式"
            className="w-50"
            items={BARCODE_FORMATS.items}
            listBoxClassName="max-h-60 overflow-y-scroll"
            placeholder="条形码格式"
            value={format}
            onChange={(value) => setFormat(value as BarcodeFormats)}
          />
          <EnumSelect
            aria-label="生成格式"
            className="w-50"
            items={BARCODE_TYPES.items}
            listBoxClassName="max-h-60 overflow-y-scroll"
            placeholder="请选择生成格式"
            value={type}
            onChange={(value) => setType(value as BarCodeTypes)}
          />
          <Input
            aria-label="条形码内容"
            className="w-50"
            placeholder="条形码内容"
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
            onPress={() => downloadImage(`barcode.${type}`)}
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
