"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { cn, NumberField, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [height, setHeight] = useState(168); // 身高
  const [weight, setWeight] = useState(60); // 体重

  // 参数处理
  const params = useMemo(
    () => ({
      height,
      weight,
    }),
    [height, weight],
  );

  // 实际请求参数（已提交模式：点击计算才更新，变化自动重查）
  const { params: queryParams, commit } = useCommittedParams(params);

  // 请求数据：key 含已提交参数，提交后参数变化自动请求
  const {
    data = {},
    loading,
    error,
    mutate,
  } = useSwrQuery([pathname, queryParams], async () =>
    get(await getApiData(pathname, queryParams), "data", {}),
  );

  // 提交计算：参数没变时 key 不变，SWR 不会发请求 → 手动刷新
  const handleCalculate = () => {
    if (!commit(params)) {
      mutate();
    }
  };

  // 计算 bmi 是否正常
  // 区间与后端 api/bmi/route.ts 的分级阈值保持一致：
  // [18.5, 24.9) 为「正常体重」，改这里必须同步后端
  const isNormal = useMemo(() => {
    const bmi = get(data, "bmi", 0);

    return bmi >= 18.5 && bmi < 24.9;
  }, [data]);

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
          loadingText="正在计算..."
          reFresh={mutate}
        >
          <div className="flex justify-center items-center flex-wrap gap-2">
            <div className="flex gap-2 items-center">
              <span>您的 BMI 是：</span>
              <span className={cn(isNormal ? "text-accent" : "text-danger")}>
                {get(data, "bmi", "--")}
              </span>
              <span>身体状态:</span>
              <span className={cn(isNormal ? "text-accent" : "text-danger")}>
                {get(data, "status", "")}
              </span>
            </div>
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField
            aria-label="身高"
            formatOptions={{
              style: "unit",
              unit: "centimeter",
              unitDisplay: "narrow",
            }}
            maxValue={1000}
            minValue={1}
            value={height}
            onChange={setHeight}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-30" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField
            aria-label="体重"
            formatOptions={{
              style: "unit",
              unit: "kilogram",
              unitDisplay: "long",
            }}
            maxValue={500}
            minValue={1}
            value={weight}
            onChange={setWeight}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-30" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton
            loading={loading}
            text="计算"
            onPress={handleCalculate}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
