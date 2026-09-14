"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { Chip, ListBox, Select, Table, Typography } from "@heroui/react";
import dayjs from "dayjs";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import EmptyContent from "@/components/EmptyContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TableLoading from "@/components/TableLoading";
import { useSwrQuery } from "@/hooks/use-swr";
import { buildYearOptions, get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const currentYear = dayjs().year();

const yearOptions = buildYearOptions(2002, currentYear);

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [year, setYear] = useState(currentYear);

  // 参数处理
  const params = useMemo(() => ({ year }), [year]);

  // 请求数据
  const {
    data = [],
    loading,
    error,
    mutate,
  } = useSwrQuery(pathname, async () =>
    get(await getApiData(pathname, params), "data", []),
  );

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
                    <Table.Column isRowHeader>假期名称</Table.Column>
                    <Table.Column>假期范围</Table.Column>
                    <Table.Column>假期长度</Table.Column>
                    <Table.Column>假期余额</Table.Column>
                    <Table.Column>距离</Table.Column>
                    <Table.Column>调休日期</Table.Column>
                  </Table.Header>
                  <Table.Body
                    renderEmptyState={() => (loading ? null : <EmptyContent />)}
                  >
                    {data?.length
                      ? data.map(
                          (
                            {
                              name,
                              start,
                              end,
                              length,
                              balance,
                              distance,
                              work = [],
                            },
                            _index,
                          ) => (
                            <Table.Row key={`${name}-${start}`}>
                              <Table.Cell>
                                <Chip color="accent" variant="soft">
                                  {name}
                                </Chip>
                              </Table.Cell>
                              <Table.Cell>{`${start} ~ ${end}`}</Table.Cell>
                              <Table.Cell>{`${length}天`}</Table.Cell>
                              <Table.Cell>{`${balance}天`}</Table.Cell>
                              <Table.Cell>
                                {distance === 0
                                  ? `太好了，今天是${name}!`
                                  : distance < 0
                                    ? `已过去${Math.abs(distance)}天`
                                    : `还有${distance}天`}
                              </Table.Cell>
                              <Table.Cell>
                                {work.length ? (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {work.map((v) => (
                                      <Chip key={v} variant="soft">
                                        {v}
                                      </Chip>
                                    ))}
                                  </div>
                                ) : (
                                  <Chip color="warning" variant="soft">
                                    不调休
                                  </Chip>
                                )}
                              </Table.Cell>
                            </Table.Row>
                          ),
                        )
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
          <Select
            aria-label="年份"
            className="w-50"
            placeholder="请选择年份"
            value={year}
            onChange={(value) => setYear(value as number)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {yearOptions.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <RefreshButton loading={loading} onPress={() => mutate()} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
