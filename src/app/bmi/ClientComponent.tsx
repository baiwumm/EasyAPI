'use client'
import { cn, NumberField } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, useMemo, useState } from 'react';

import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

type ClientComponentProps = {
  title: string;
}

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [height, setHeight] = useState(168); // 身高
  const [weight, setWeight] = useState(60); // 体重

  // 参数处理
  const params = useMemo(() => ({
    height, weight
  }), [height, weight]);

  // 请求数据
  const { data = {}, loading, error, run } = useRequest(
    async () => get(await getApiData(pathname, params), 'data', {}));

  // 计算 bmi 是否正常
  const isNormal = useMemo(() => {
    const bmi = get(data, 'bmi', 0);
    return bmi >= 18.5 && bmi <= 23.9;
  }, [data])
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={run} loading={loading} loadingText='正在计算...'>
          <div className="flex justify-center items-center flex-wrap gap-2">
            <div className="flex gap-2 items-center">
              <span>您的 BMI 是：</span>
              <span className={cn(isNormal ? 'text-accent' : 'text-danger')}>{get(data, 'bmi', '--')}</span>
              <span>身体状态:</span>
              <span className={cn(isNormal ? 'text-accent' : 'text-danger')}>{get(data, 'status', '')}</span>
            </div>
          </div>
        </RequestContent>
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
          <RefreshButton text='计算' loading={loading} onPress={run} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent;