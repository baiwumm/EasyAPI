"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { ArrowDownToSquare, CircleXmarkFill } from "@gravity-ui/icons";
import {
  Button,
  Description,
  Input,
  ListBox,
  Select,
  toast,
  Typography,
} from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { BARCODE_FORMATS, BARCODE_TYPES, RESPONSE } from "@/enums";
import { useSwrMutation } from "@/hooks/use-swr";
import { isSuccess } from "@/lib/utils";

type BarcodeFormats = typeof BARCODE_FORMATS.valueType;
type BarCodeTypes = typeof BARCODE_TYPES.valueType;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [text, setText] = useState(process.env.NEXT_PUBLIC_APP_NAME!); // 图形码内容
  const [type, setType] = useState<BarCodeTypes>(BARCODE_TYPES.SVG); // 生成格式
  const [format, setFormat] = useState<BarcodeFormats>(BARCODE_FORMATS.CODE128); // 条形码格式
  const [imgSrc, setImgSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // 参数处理
  const params = useMemo(() => ({ type, format, text }), [type, format, text]);

  // 请求数据
  const { loading, error, trigger } = useSwrMutation(
    `${pathname}:generate`, // mutation key 加后缀，避免与其他查询 key 冲突
    async () => {
      const { type, format, text } = params;

      // 构造查询参数
      const searchParams = new URLSearchParams();

      searchParams.set("format", format);
      searchParams.set("type", type);
      searchParams.set("text", text);

      const url = `/api/${pathname}?${searchParams.toString()}`;

      const res = await fetch(url);

      const contentType = res.headers.get("content-type") || "";

      // 如果是 JSON，说明是错误信息
      if (contentType.includes("application/json")) {
        const { code, msg } = await res.json();

        if (!isSuccess(code)) {
          toast.danger(msg || RESPONSE.label(RESPONSE.ERROR), {
            indicator: <CircleXmarkFill />,
            timeout: 3000,
          });
        }

        return null;
      }

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      // 根据 type 决定如何读取响应
      if (type === "svg") {
        const svgText = await res.text();

        // 转为 data URL 以便 img 标签显示
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      } else {
        // type === 'png' 或其他二进制格式
        const blob = await res.blob();

        return URL.createObjectURL(blob);
      }
    },
    {
      // 网络异常：清掉旧图，避免把旧结果误读为本次生成成功
      onError: () => {
        setImgSrc("");
        setDownloadUrl("");
      },
      onSuccess: (res) => {
        if (downloadUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(downloadUrl);
        }
        if (res) {
          setImgSrc(res);
          setDownloadUrl(res); // 用于下载
        } else {
          // 业务失败：清掉旧图
          setImgSrc("");
          setDownloadUrl("");
        }
      },
    },
  );

  // 挂载自动生成一次（等价原自动模式）
  useEffect(() => {
    trigger();
  }, []);

  // 请求数据
  const reFresh = () => {
    if (!text?.trim()) {
      toast.danger("参数 text 必填");

      return;
    }
    trigger();
  };

  // 下载图片
  const downloadImage = () => {
    if (!downloadUrl || !type) return;
    toast.success("正在下载中...");
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `barcode.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //  format 配置

  const formatRaw = useMemo(() => BARCODE_FORMATS.raw(format), [format]);

  useEffect(() => {
    return () => {
      if (imgSrc && imgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imgSrc]);

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
          <Select
            aria-label="条形码格式"
            className="w-50"
            placeholder="条形码格式"
            value={format}
            onChange={(value) => setFormat(value as BarcodeFormats)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {BARCODE_FORMATS.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            aria-label="生成格式"
            className="w-50"
            placeholder="请选择生成格式"
            value={type}
            onChange={(value) => setType(value as BarCodeTypes)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {BARCODE_TYPES.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
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
            onPress={downloadImage}
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
