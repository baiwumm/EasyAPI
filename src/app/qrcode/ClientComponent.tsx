"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { ArrowDownToSquare, CircleXmarkFill } from "@gravity-ui/icons";
import {
  Button,
  Input,
  ListBox,
  NumberField,
  Select,
  toast,
  Typography,
} from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { QRCODE_FORMATS, RESPONSE } from "@/enums";
import { useSwrMutation } from "@/hooks/use-swr";
import { isSuccess } from "@/lib/utils";

type Format = typeof QRCODE_FORMATS.valueType;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [format, setFormat] = useState<Format>(QRCODE_FORMATS.PNG); // 生成格式
  const [size, setSize] = useState(256); // 二维码大小
  const [text, setText] = useState(process.env.NEXT_PUBLIC_APP_NAME!);
  const [imgSrc, setImgSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // 参数处理
  const params = useMemo(() => ({ format, size, text }), [format, size, text]);

  // 请求数据：mutation 语义（挂载自动生成一次 + 点击触发），onSuccess 写图片 state
  const { loading, error, trigger } = useSwrMutation(
    `${pathname}:generate`, // mutation key 加后缀，避免与其他查询 key 冲突
    async () => {
      const { format, size, text } = params;

      // 构造查询参数
      const searchParams = new URLSearchParams();

      searchParams.set("format", String(format));
      searchParams.set("size", String(size));
      searchParams.set("text", text);

      const url = `/api/${pathname}?${searchParams.toString()}`;

      const res = await fetch(url);

      const contentType = res.headers.get("content-type") || "";

      // JSON 响应：dataurl 格式的成功结果或业务错误信息，按 code 区分
      if (contentType.includes("application/json")) {
        const { code, msg, data } = await res.json();

        if (format === QRCODE_FORMATS.DATAURL && isSuccess(code)) {
          return data as string;
        }

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

      // 根据 format 决定如何读取响应
      if (format === QRCODE_FORMATS.SVG) {
        const svgText = await res.text();

        // 转为 data URL 以便 img 标签显示
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      }

      // format === 'png' 或其他二进制格式
      const blob = await res.blob();

      return URL.createObjectURL(blob);
    },
    {
      // 网络异常：清掉旧图，避免把旧结果误读为本次生成成功
      onError: () => {
        setImgSrc("");
        setDownloadUrl("");
      },
      onSuccess: (imgUrl) => {
        if (downloadUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(downloadUrl);
        }
        if (imgUrl) {
          setImgSrc(imgUrl);
          setDownloadUrl(imgUrl); // 用于下载
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
    setImgSrc("");
    if (!text?.trim()) {
      toast.danger("参数 text 必填");

      return;
    }
    if (text.length > 2000) {
      toast.danger("参数 text 长度不能超过 2000 个字符");

      return;
    }
    trigger();
  };

  // 下载图片
  const downloadImage = () => {
    if (!downloadUrl || !format) return;
    toast.success("正在下载中...");
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `qrcode.${format === "dataurl" ? "png" : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <Select
            aria-label="生成格式"
            className="w-50"
            placeholder="请选择生成格式"
            value={format}
            onChange={(value) => setFormat(value as Format)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {QRCODE_FORMATS.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
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
