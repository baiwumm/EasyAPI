"use client";
import type { ReactNode } from "react";

import { Form, Table, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";

import CopyText from "@/components/CopyText";
import EmptyContent from "@/components/EmptyContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TableLoading from "@/components/TableLoading";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

export interface Column {
  label: string;
  children: ReactNode;
}

export type GetColumnsFn<T> = (data: T) => Column[];

interface JsonContentProps<T> {
  title: string;
  children: ReactNode;
  params: Record<string, any>;
  onRefresh: () => boolean;
  searchText?: string;
  getColumns: GetColumnsFn<T>;
}

function JsonContent<T>({
  title,
  children,
  params = {},
  onRefresh,
  searchText = "查询",
  getColumns,
}: JsonContentProps<T>) {
  const pathname = usePathname();

  // 实际请求参数（已提交模式）：输入框变化只更新本地 state，
  // 点「查询/检测」提交后才进 SWR key，避免每次按键都打一次接口
  const { params: queryParams, commit } = useCommittedParams(params);

  // 请求数据：key 含已提交参数，提交后参数变化自动请求
  const { data, loading, error, mutate } = useSwrQuery<T>(
    [pathname, queryParams],
    async () => get(await getApiData(pathname, queryParams), "data"),
  );

  // 请求数据：参数没变时 key 不变，SWR 不会发请求 → 用 mutate() 手动刷新
  const reload = () => {
    if (!onRefresh()) {
      return;
    }
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
        <RequestContent error={error} reFresh={reload}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer>
                <Table.Content aria-label={title} className="min-w-80">
                  <Table.Header>
                    <Table.Column isRowHeader>字段</Table.Column>
                    <Table.Column>值</Table.Column>
                  </Table.Header>
                  <Table.Body
                    renderEmptyState={() => (loading ? null : <EmptyContent />)}
                  >
                    {(data ? getColumns(data) : []).map(
                      ({ label, children }, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{label}</Table.Cell>
                          <Table.Cell>{children}</Table.Cell>
                        </Table.Row>
                      ),
                    )}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
            <TableLoading loading={loading} />
          </div>
        </RequestContent>
      </div>
      {/* 底部区域（Form + 隐藏提交按钮：让 children 里的输入框支持回车查询） */}
      <div className="flex justify-center shrink-0">
        <Form
          className="flex items-center gap-2 flex-wrap"
          onSubmit={(event) => {
            event.preventDefault();
            reload();
          }}
        >
          {children}
          <button aria-hidden="true" className="hidden" type="submit" />
          <RefreshButton loading={loading} text={searchText} onPress={reload} />
          <CopyText
            content={
              Object.keys(data || {}).length > 0
                ? JSON.stringify(data || {}, null, 2)
                : ""
            }
          />
        </Form>
      </div>
    </div>
  );
}
export default JsonContent;
