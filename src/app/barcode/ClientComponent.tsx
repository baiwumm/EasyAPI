'use client'
import { ArrowDownToSquare, CircleXmarkFill } from '@gravity-ui/icons';
import { Button, Description, Input, ListBox, Select, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type FC, useEffect, useMemo, useState } from 'react';

import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import { BARCODE_FORMATS, BARCODE_TYPES, RESPONSE } from '@/enums'
import { isSuccess } from '@/lib/utils';

type BarCodeTypes = typeof BARCODE_TYPES.valueType;
type BarcodeFormats = typeof BARCODE_FORMATS.valueType;

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [text, setText] = useState(process.env.NEXT_PUBLIC_APP_NAME!); // 图形码内容
  const [type, setType] = useState<BarCodeTypes>(BARCODE_TYPES.SVG); // 生成格式
  const [format, setFormat] = useState<BarcodeFormats>(BARCODE_FORMATS.CODE128); // 条形码格式
  const [imgSrc, setImgSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // 参数处理
  const params = useMemo(() => ({ type, format, text }), [type, format, text]);

  // 请求数据
  const { loading, error, run } = useRequest(
    async () => {
      const { type, format, text } = params;

      // 构造查询参数
      const searchParams = new URLSearchParams();
      searchParams.set('format', format);
      searchParams.set('type', type);
      searchParams.set('text', text);

      const url = `/api/${pathname}?${searchParams.toString()}`;

      const res = await fetch(url);

      const contentType = res.headers.get("content-type") || "";

      // 如果是 JSON，说明是错误信息
      if (contentType.includes("application/json")) {
        const { code, msg } = await res.json();
        if (!isSuccess(code)) {
          toast.danger(msg || RESPONSE.label(RESPONSE.ERROR), {
            indicator: <CircleXmarkFill />,
            timeout: 3000
          })
        }
        return null;
      }

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      // 根据 type 决定如何读取响应
      if (type === 'svg') {
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
      onSuccess: (res) => {
        if (res) {
          if (downloadUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(downloadUrl);
          }
          setImgSrc(res);
          setDownloadUrl(res); // 用于下载
        }
      },
    }
  );

  // 请求数据
  const reFresh = () => {
    if (!text?.trim()) {
      toast.danger("参数 text 必填");
      return;
    }
    run();
  }

  // 下载图片
  const downloadImage = () => {
    if (!downloadUrl || !type) return;
    toast.success("正在下载中...")
    const link = document.createElement('a');
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
      if (imgSrc && imgSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imgSrc]);
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={reFresh} loading={loading} loadingText='正在生成...'>
          <div className="flex justify-center items-center">
            <div className="relative flex flex-col gap-2 items-center min-h-60">
              {imgSrc ? (
                <>
                  <Image
                    src={imgSrc}
                    alt={text || "条形码"}
                    width={1108}
                    height={592}
                    className="max-w-125 h-auto"
                    unoptimized
                  />
                  <Description className="text-danger">{formatRaw.description}</Description>
                  {formatRaw.hint && <Description className="text-danger">提示: {formatRaw.hint}</Description>}
                  {formatRaw.charset && <Description className="text-danger">允许字符: {formatRaw.charset}</Description>}
                  {formatRaw.example && <Description className="text-danger">示例: {formatRaw.example}</Description>}
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
            className="w-50"
            placeholder="条形码格式"
            aria-label="条形码格式"
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
                  <ListBox.Item
                    key={value}
                    id={value}
                    textValue={label}
                  >
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            className="w-50"
            placeholder="请选择生成格式"
            value={type}
            onChange={(value) => setType(value as BarCodeTypes)}
            aria-label="生成格式"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {BARCODE_TYPES.items.map(({ value, label }) => (
                  <ListBox.Item
                    key={value}
                    id={value}
                    textValue={label}
                  >
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Input value={text} onChange={(event) => setText(event.target.value)} aria-label="二维码内容" placeholder='二维码内容' className="w-50" />
          <RefreshButton text='生成' loading={loading} onPress={reFresh} />
          <Button size='sm' variant='tertiary' isDisabled={!downloadUrl || loading} onPress={downloadImage}>
            <ArrowDownToSquare />
            下载
          </Button>
        </div>
      </div>
    </div>
  )
}
export default ClientComponent