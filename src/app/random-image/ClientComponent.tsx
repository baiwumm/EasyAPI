"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { Button, NumberField, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import GridReveal from "@/components/GridReveal";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useCopy } from "@/hooks/use-copy";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const { copy } = useCopy();
  const pathname = usePathname();

  const [count, setCount] = useState(5);
  const [size, setSize] = useState(128);
  // 用户主动刷新中（mutate 期间）：用于触发替换式 loading 重挂载网格
  const [refreshing, setRefreshing] = useState(false);

  // 实际请求参数（已提交模式：点击重新生成才更新，变化自动重查）
  const { params, commit } = useCommittedParams({
    count,
    width: size,
    height: size,
  });

  // 请求数据：key 含已提交参数，点击后 params 变化自动请求
  const {
    data = [],
    isLoading,
    isValidating,
    error,
    mutate,
  } = useSwrQuery([pathname, params], async () =>
    get(await getApiData(pathname, params), "data", []),
  );

  const handleGenerate = () => {
    // 参数没变时 key 不变，SWR 不会发请求 → 手动刷新。
    // mutate 期间标记 refreshing：GridReveal 的揭示动画要在子树重挂载后才重新播，
    // 而后台再验证（窗口聚焦）不该打断正在播的动画（D1）
    if (!commit({ count, width: size, height: size })) {
      setRefreshing(true);
      void mutate().finally(() => setRefreshing(false));
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
          // 首屏/参数变化/用户主动刷新才卸载重挂载（GridReveal 要重新播动画），
          // 后台再验证只让按钮转圈，不再把整片网格卸载掉
          loading={isLoading || refreshing}
          loadingText="正在生成..."
          reFresh={handleGenerate}
        >
          <div className="flex items-center gap-4 flex-wrap">
            {data.map((url) => (
              <Button
                key={url}
                aria-label={`复制${title}地址`}
                className="h-auto min-w-0 rounded-xl bg-transparent p-0 shadow-none hover:scale-[1.01] hover:bg-transparent"
                variant="ghost"
                onPress={() => {
                  void copy(url);
                }}
              >
                <GridReveal
                  alt={title}
                  aspect={params.width / params.height}
                  className="rounded-xl"
                  estimatedDuration={1600}
                  src={url}
                  style={{ width: params.width }}
                />
              </Button>
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

          <RefreshButton
            loading={isValidating}
            text="重新生成"
            onPress={handleGenerate}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
