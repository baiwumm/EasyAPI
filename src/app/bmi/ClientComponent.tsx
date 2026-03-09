'use client'
import { cn, NumberField } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import LoadingContent from '@/components/LoadingContent';
import RefreshButton from '@/components/RefreshButton';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const [height, setHeight] = useState(168); // 身高
  const [weight, setWeight] = useState(60); // 体重

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', {}), {
    defaultParams: [{ height, weight }]
  },
  );

  // 请求数据
  const reFresh = () => {
    run({ height, weight });
  }

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
      return <LoadingContent text='正在计算...' />
    }
    const bmi = get(data, 'bmi', 0);
    const isNormal = bmi >= 18.5 && bmi <= 23.9;
    return (
      <div className="flex justify-center items-center flex-wrap gap-2">
        <div className="flex gap-2 items-center">
          <span>您的 BMI 是：</span>
          <span className={cn(isNormal ? 'text-accent' : 'text-danger')}>{get(data, 'bmi', '--')}</span>
          <span>身体状态:</span>
          <span className={cn(isNormal ? 'text-accent' : 'text-danger')}>{get(data, 'status', '')}</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">BMI 计算器</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField
            minValue={1}
            maxValue={1000}
            value={height}
            onChange={setHeight}
            aria-label="身高"
            formatOptions={{
              style: "unit",
              unit: "centimeter",
              unitDisplay: "narrow",
            }}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-30" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <NumberField
            minValue={1}
            maxValue={500}
            value={weight}
            onChange={setWeight}
            aria-label="体重"
            formatOptions={{
              style: "unit",
              unit: "kilogram",
              unitDisplay: "long",
            }}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-30" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton text='计算' loading={loading} onPress={reFresh} />
        </div>
      </div>
    </div>
  )
}