"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { Input, Table, toast, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import EmptyContent from "@/components/EmptyContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TableLoading from "@/components/TableLoading";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

interface DataType {
  englishName: string;
  name: string;
  countryCode: string;
  phoneCode: string;
}

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [keyword, setKeyword] = useState("中国");

  // 参数处理
  const params = useMemo(() => ({ keyword }), [keyword]);

  // 请求数据
  const {
    data = [],
    loading,
    error,
    mutate,
  } = useSwrQuery(pathname, async () =>
    get(await getApiData(pathname, params), "data", []),
  );

  // 请求数据
  const reFresh = () => {
    if (!keyword.trim()) {
      toast.danger("参数 keyword 必填");

      return;
    }
    mutate();
  };

  // 列定义
  const columns: { label: string; value: keyof DataType }[] = [
    { label: "国家（中文）", value: "englishName" },
    { label: "国家（英文）", value: "name" },
    { label: "ISO国家代码", value: "countryCode" },
    { label: "国际电话区号", value: "phoneCode" },
  ];

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
        <RequestContent error={error} reFresh={reFresh}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    {columns.map(({ label, value }) => (
                      <Table.Column
                        key={value}
                        isRowHeader={value === "englishName"}
                      >
                        {label}
                      </Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body renderEmptyState={() => <EmptyContent />}>
                    {data?.length
                      ? data.map((v, index) => (
                          <Table.Row key={index}>
                            {columns.map(({ value }) => (
                              <Table.Cell key={value}>
                                {get(v, value, "--")}
                              </Table.Cell>
                            ))}
                          </Table.Row>
                        ))
                      : []}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
            <TableLoading loading={loading} />
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            aria-label={title}
            className="w-50"
            maxLength={50}
            placeholder="请输入关键字查询"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <RefreshButton loading={loading} onPress={reFresh} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
