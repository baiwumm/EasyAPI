"use client";
import type { DateValue } from "@heroui/react";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import {
  Calendar,
  Chip,
  DateField,
  DatePicker,
  Table,
  Typography,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import EmptyContent from "@/components/EmptyContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TableLoading from "@/components/TableLoading";
import { useCommittedParams } from "@/hooks/use-committed-params";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

interface DataType {
  date: string;
  hours: string;
  hour: string;
  yi: string;
  ji: string;
  chong: string;
  sha: string;
  nayin: string;
  jiuxing: string;
}

// 列定义不依赖 state/props，提升为模块级常量
const columns: { label: string; value: keyof DataType; className?: string }[] =
  [
    { label: "日期", value: "date" },
    { label: "时段", value: "hours", className: "w-40" },
    { label: "时辰", value: "hour", className: "w-20" },
    { label: "宜", value: "yi" },
    { label: "忌", value: "ji" },
    { label: "冲", value: "chong" },
    { label: "煞", value: "sha" },
    { label: "纳音", value: "nayin" },
    { label: "九星", value: "jiuxing" },
  ];

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  // 初始为 null（两端一致），挂载后再取用户本地时区的"今天"：
  // 服务端时区与用户时区可能不同天，直接初始化会 hydration mismatch
  const [date, setDate] = useState<DateValue | null>(null);

  useEffect(() => {
    // 时区相关的"今天"只能在客户端确定，挂载期 setState 是有意为之
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setDate(today(getLocalTimeZone()));
  }, []);

  // 参数处理
  const params = useMemo(
    () => ({
      date: date?.toString() ?? "",
    }),
    [date],
  );

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

  // 提交查询：参数没变时 key 不变，SWR 不会发请求 → 手动刷新
  const handleSearch = () => {
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
        <RequestContent error={error} reFresh={mutate}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    {columns.map(({ label, value }) => (
                      <Table.Column key={value} isRowHeader={value === "date"}>
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
                            {columns.map(({ value, className }) =>
                              value === "date" ? (
                                <Table.Cell key={value} className="w-35">
                                  <Chip color="accent" variant="soft">
                                    {get(v, "date", "--")}
                                  </Chip>
                                </Table.Cell>
                              ) : (
                                <Table.Cell
                                  key={value}
                                  className={className || "min-w-30"}
                                >
                                  {get(v, value, "--")}
                                </Table.Cell>
                              ),
                            )}
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
          <DatePicker
            aria-label={title}
            className="w-70"
            name="date"
            value={date}
            onChange={setDate}
          >
            <DateField.Group fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
              <Calendar aria-label={title}>
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>
          <RefreshButton loading={loading} onPress={handleSearch} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
