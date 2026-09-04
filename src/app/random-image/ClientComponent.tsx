"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { NumberField, Typography } from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { useCopy } from "@/hooks/use-copy";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const { copy } = useCopy();
  const pathname = usePathname();

  const [count, setCount] = useState(5);
  const [size, setSize] = useState(128);

  // 实际请求参数
  const [params, setParams] = useState({
    count,
    width: size,
    height: size,
  });

  // 请求数据：key 含已提交参数，点击后 params 变化自动请求
  const {
    data = [],
    loading,
    error,
    mutate,
  } = useSwrQuery([pathname, params], async () =>
    get(await getApiData(pathname, params), "data", []),
  );

  const handleGenerate = () => {
    const newParams = { count, width: size, height: size };

    setParams(newParams);
    // 参数没变时 key 不变，SWR 不会发请求 → 手动刷新
    if (JSON.stringify(newParams) === JSON.stringify(params)) {
      mutate();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部 */}
      <div className="shrink-0">
        <Typography className="text-2xl font-black tracking-normal" type="h1">
          {title}
        </Typography>
      </div>

      {/* 中间 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent
          error={error}
          loading={loading}
          loadingText="正在生成..."
          reFresh={handleGenerate}
        >
          <div className="flex items-center gap-4 flex-wrap">
            {data.map((url) => (
              <Image
                key={url}
                alt={title}
                className="rounded-xl cursor-pointer"
                height={params.height}
                loading="eager"
                src={url}
                width={params.width}
                onClick={() => copy(url)}
              />
            ))}
          </div>
        </RequestContent>
      </div>

      {/* 底部 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField
            aria-label="生成的数量"
            maxValue={50}
            minValue={1}
            value={count}
            onChange={setCount}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>

          <NumberField
            aria-label="生成大小"
            maxValue={512}
            minValue={16}
            value={size}
            onChange={setSize}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>

          <RefreshButton text="重新生成" onPress={handleGenerate} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
