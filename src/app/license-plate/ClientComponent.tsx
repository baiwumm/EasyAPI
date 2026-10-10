"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { Input, Table, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import EmptyContent from "@/components/EmptyContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TableLoading from "@/components/TableLoading";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useRequireParam } from "@/hooks/use-require-param";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

interface DataType {
  province: string;
  city: string;
  code: string[];
  prefix: string;
}

// 列定义（静态，提升模块级避免每次渲染重建）
const columns: { label: string; value: keyof DataType }[] = [
  { label: "省份", value: "province" },
  { label: "城市", value: "city" },
  { label: "省份车牌简称", value: "code" },
  { label: "电车牌号前缀号", value: "prefix" },
];

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [keyword, setKeyword] = useState("粤");
  const requireParam = useRequireParam();

  // 参数处理
  const params = useMemo(() => ({ keyword }), [keyword]);

  // 实际请求参数（已提交模式：点击查询才更新，变化自动重查）
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

  // 请求数据
  const reFresh = () => {
    if (!requireParam(keyword, "keyword")) {
      return;
    }
    // 参数没变时 key 不变，SWR 不会发请求 → 手动刷新
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
      <div className="relative flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={mutate}>
          <div className="flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    {columns.map(({ label, value }) => (
                      <Table.Column
                        key={value}
                        isRowHeader={value === "province"}
                      >
                        {label}
                      </Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body
                    renderEmptyState={() => (loading ? null : <EmptyContent />)}
                  >
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
            aria-label="关键字"
            className="w-50"
            maxLength={50}
            placeholder="输入关键字，如粤A、广州市"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                reFresh();
              }
            }}
          />
          <RefreshButton loading={loading} onPress={reFresh} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
