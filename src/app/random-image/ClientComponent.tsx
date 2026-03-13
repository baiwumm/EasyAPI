'use client'
import { NumberField } from '@heroui/react';
import { useRequest } from 'ahooks';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { type FC, useState } from 'react';

import RefreshButton from '@/components/RefreshButton';
import RequestContent from '@/components/RequestContent';
import { useCopy } from '@/hooks/use-copy';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

const ClientComponent: FC<App.ClientComponentProps> = ({ title }) => {
  const { copy } = useCopy();
  const pathname = usePathname();

  const [count, setCount] = useState(5);
  const [size, setSize] = useState(128);

  // 实际请求参数
  const [params, setParams] = useState({
    count,
    width: size,
    height: size
  });

  const { data = [], loading, error, run } = useRequest(
    async (params) => get(await getApiData(pathname, params), 'data', []), {
    defaultParams: [params]
  }
  );

  const handleGenerate = () => {
    const newParams = { count, width: size, height: size };
    setParams(newParams);
    run(newParams);
  };

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">{title}</h1>
      </div>

      {/* 中间 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={handleGenerate} loading={loading} loadingText="正在生成...">
          <div className="flex items-center gap-4 flex-wrap">
            {data.map((url) => (
              <Image
                key={url}
                src={url}
                alt={title}
                width={params.width}
                height={params.height}
                className="rounded-xl cursor-pointer"
                loading='eager'
                onClick={() => copy(url)}
              />
            ))}
          </div>
        </RequestContent>
      </div>

      {/* 底部 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <NumberField minValue={1} maxValue={50} value={count} onChange={setCount} aria-label='生成的数量'>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-20" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>

          <NumberField minValue={16} maxValue={512} value={size} onChange={setSize} aria-label="生成大小">
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