'use client'
import { Copy } from '@gravity-ui/icons';
import { Chip, NumberField } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { type FC, useMemo, useState } from 'react';

import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const { copy } = useCopy();
  const [count, setCount] = useState(10); // 生成的数量

  // 参数处理
  const params = useMemo(() => ({ count }), [count]);

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async () => get(await getApiData(pathname, params), 'data', [])
  );
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={run} loading={loading} loadingText='正在生成...'>
          <div className="flex justify-center items-center flex-wrap gap-2">
            {data.map((v) => (
              <Chip
                key={v}
                size='lg'
                color='accent'
                variant='soft'
                onClick={() => copy(v)}
                className="cursor-pointer"
              >
                <Copy />
                <Chip.Label>{v}</Chip.Label>
              </Chip>
            ))}
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField minValue={1} maxValue={50} value={count} onChange={setCount} aria-label="生成的数量">
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton text='生成' loading={loading} onPress={run} />
        </div>
      </div>
    </div>
  )
}
export default ClientComponent