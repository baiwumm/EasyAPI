"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { ListBox, NumberField, Select, Typography } from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import { PERSON_SEXS, PERSON_SIZES } from "@/enums";
import { useCopy } from "@/hooks/use-copy";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

type PersonSex = typeof PERSON_SEXS.valueType;
type PersonSize = typeof PERSON_SIZES.valueType;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const { copy } = useCopy();
  const pathname = usePathname();

  const [count, setCount] = useState(5);
  const [sex, setSex] = useState<PersonSex>(PERSON_SEXS.GENERIC);
  const [size, setSize] = useState<PersonSize>(PERSON_SIZES.SIZE_128);

  // 已提交的请求参数：点击"重新生成"才更新，输入变化不触发请求
  const [query, setQuery] = useState({ count, sex, size });

  // 请求数据：key 含已提交参数，点击后 query 变化自动请求
  const {
    data = [],
    loading,
    error,
    mutate,
  } = useSwrQuery([pathname, query], async () =>
    get(await getApiData(pathname, query), "data", []),
  );

  const handleGenerate = () => {
    const next = { count, sex, size };

    setQuery(next);
    // 参数没变时 key 不变，SWR 不会发请求 → 手动刷新
    if (JSON.stringify(next) === JSON.stringify(query)) {
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
                height={size}
                loading="eager"
                src={url}
                width={size}
                onClick={() => copy(url)}
              />
            ))}
          </div>
        </RequestContent>
      </div>

      {/* 底部 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            aria-label="性别"
            className="w-50"
            placeholder="性别"
            value={sex}
            onChange={(value) => setSex(value as PersonSex)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {PERSON_SEXS.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            aria-label="头像大小"
            className="w-50"
            placeholder="头像大小"
            value={size}
            onChange={(value) => setSize(value as PersonSize)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {PERSON_SIZES.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
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

          <RefreshButton text="重新生成" onPress={handleGenerate} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
