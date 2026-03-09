'use client'
import { ArrowDownToSquare } from '@gravity-ui/icons';
import { Button, Input, type Key, ListBox, NumberField, Select, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import AlertContent from '@/components/AlertContent';
import LoadingContent from '@/components/LoadingContent';
import RefreshButton from '@/components/RefreshButton';

const formatOptions = [
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "dataurl", label: "DATAURL" },
];

export default function ClientComponent() {
  const pathname = usePathname();
  const [format, setFormat] = useState<Key | null>("png"); // 生成格式
  const [size, setSize] = useState(256); // 二维码大小
  const [text, setText] = useState(process.env.NEXT_PUBLIC_APP_NAME!);
  const [imgSrc, setImgSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // 请求数据
  const { loading, error, run } = useRequest(
    async (params) => {
      const { format, size, text } = params;

      // 构造查询参数
      const searchParams = new URLSearchParams();
      searchParams.set('format', String(format));
      searchParams.set('size', String(size));
      searchParams.set('text', text);

      const url = `/api/${pathname}?${searchParams.toString()}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      // 根据 format 决定如何读取响应
      if (format === 'dataurl') {
        const json = await res.json();
        return json.data; // 直接返回 data 字符串
      } else if (format === 'svg') {
        const svgText = await res.text();
        // 转为 data URL 以便 img 标签显示
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      } else {
        // format === 'png' 或其他二进制格式
        const blob = await res.blob();
        return URL.createObjectURL(blob);
      }
    },
    {
      defaultParams: [{ format, size, text }],
      onSuccess: (imgUrl) => {
        setImgSrc(imgUrl);
        setDownloadUrl(imgUrl); // 用于下载
      },
    }
  );

  // 请求数据
  const reFresh = () => {
    setImgSrc('');
    if (!text?.trim()) {
      toast.danger("参数 text 必填");
      return;
    }
    if (text.length > 2000) {
      toast.danger("参数 text 长度不能超过 2000 个字符");
      return;
    }
    run({ format, size, text });
  }

  // 下载图片
  const downloadImage = () => {
    if (!downloadUrl || !format) return;
    toast.success("正在下载中...")
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `qrcode.${format === 'dataurl' ? 'png' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    return () => {
      if (imgSrc && imgSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imgSrc]);

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
      return <LoadingContent text='正在生成...' />
    }
    return (
      <div className="flex justify-center items-center">
        <Image
          src={imgSrc}
          alt={text || "二维码"}
          width={size}
          height={size}
        />
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">生成二维码</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            className="w-50"
            placeholder="请选择生成格式"
            value={format}
            onChange={(value) => setFormat(value)}
            aria-label="生成格式"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {formatOptions.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <NumberField minValue={64} maxValue={1000} value={size} onChange={setSize} aria-label="二维码大小">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
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