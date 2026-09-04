"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import {
  Avatar,
  Chip,
  Description,
  ListBox,
  NumberField,
  Select,
  Table,
  Typography,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import EmptyContent from "@/components/EmptyContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TableLoading from "@/components/TableLoading";
import { RANDOM_USER_GENDER } from "@/enums";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

type Gender = typeof RANDOM_USER_GENDER.valueType;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [count, setCount] = useState(5);
  const [gender, setGender] = useState<Gender>(RANDOM_USER_GENDER.GENERIC);

  // 参数处理
  const params = useMemo(() => ({ count, gender }), [count, gender]);

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
      <div className="flex-1 flex justify-center items-center">
        <RequestContent error={error} reFresh={mutate}>
          <div className="relative flex justify-center items-center">
            <Table>
              <Table.ScrollContainer className="max-h-150 overflow-y-auto">
                <Table.Content aria-label={title} className="min-w-150">
                  <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
                    <Table.Column isRowHeader>姓名</Table.Column>
                    <Table.Column>性别</Table.Column>
                    <Table.Column>手机号码</Table.Column>
                    <Table.Column>公司</Table.Column>
                    <Table.Column>职位</Table.Column>
                    <Table.Column>生日</Table.Column>
                  </Table.Header>
                  <Table.Body renderEmptyState={() => <EmptyContent />}>
                    {data?.length
                      ? data.map(
                          ({
                            id,
                            name,
                            avatar,
                            gender,
                            email,
                            job,
                            phone,
                            birthday,
                            company,
                          }) => (
                            <Table.Row key={id}>
                              <Table.Cell>
                                <div className="flex items-center gap-3">
                                  <Avatar size="sm">
                                    <Avatar.Image src={avatar} />
                                    <Avatar.Fallback>
                                      {(name as string)
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </Avatar.Fallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-xs">{name}</span>
                                    <Description>{email}</Description>
                                  </div>
                                </div>
                              </Table.Cell>
                              <Table.Cell>
                                <Chip
                                  color={
                                    gender ===
                                    RANDOM_USER_GENDER.label(
                                      RANDOM_USER_GENDER.MALE,
                                    )
                                      ? "accent"
                                      : "warning"
                                  }
                                  variant="soft"
                                >
                                  {gender}
                                </Chip>
                              </Table.Cell>
                              <Table.Cell>{phone}</Table.Cell>
                              <Table.Cell>{company}</Table.Cell>
                              <Table.Cell>{job}</Table.Cell>
                              <Table.Cell>{birthday}</Table.Cell>
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
            aria-label="性别"
            className="w-50"
            placeholder="请选择性别"
            value={gender}
            onChange={(value) => setGender(value as Gender)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-scroll">
                {RANDOM_USER_GENDER.items.map(({ value, label }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <NumberField
            aria-label="数量"
            maxValue={20}
            minValue={1}
            value={count}
            onChange={setCount}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="w-30" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
          <RefreshButton
            loading={loading}
            text="生成"
            onPress={() => mutate()}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
