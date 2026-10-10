"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { NumberField, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import CopyChip from "@/components/CopyChip";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import StaggerIn from "@/components/StaggerIn";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [count, setCount] = useState(10); // 生成的数量

  // 参数处理
  const params = useMemo(() => ({ count }), [count]);

  // 实际请求参数（已提交模式：点击生成才更新，变化自动重查）
  const { params: queryParams, commit } = useCommittedParams(params);

  // 请求数据：key 含已提交参数，提交后参数变化自动请求
  const {
    data = [],
    loading,
    error,
    mutate,
  } = useSwrQuery([pathname, queryParams], async () =>
    get(await getApiData(pathname, queryParams), "data", []),
  );

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
          <StaggerIn className="flex justify-center items-center flex-wrap gap-2">
            {data.map((v) => (
              <CopyChip key={v} value={v} />
            ))}
          </StaggerIn>
        </RequestContent>
      </div>
      {/* 底部区域 */}
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
          <RefreshButton
            loading={loading}
            text="生成"
            onPress={handleGenerate}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
