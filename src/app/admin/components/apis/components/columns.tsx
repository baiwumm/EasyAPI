"use client";
import type { AppColumnDef, AppTableFeatures } from "@/typings/table-types";
import type { Api } from "@/typings";

import { Check, PencilToSquare, TrashBin, Xmark } from "@gravity-ui/icons";
import { Button, Chip, Switch, Tooltip } from "@heroui/react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<AppTableFeatures, Api>();

interface ColumnsProps {
  handleEdit: (row: Api) => void;
  handleDel: (row: Api) => void;
  page: number;
  pageSize: number;
}

export function getColumns({
  handleEdit,
  handleDel,
  page = 1,
  pageSize = 10,
}: ColumnsProps): AppColumnDef<Api, any>[] {
  const booleanColumns = [
    { key: "pinned", header: "置顶" },
    { key: "is_featured", header: "推荐" },
  ] as const;

  return [
    columnHelper.display({
      id: "index",
      enableHiding: false, // 序号/操作为功能性列，隐藏后模块失去入口
      header: "序号",
      cell: ({ row }) => <Chip>{(page - 1) * pageSize + row.index + 1}</Chip>,
    }),

    columnHelper.accessor("name", {
      header: "接口名称",
      cell: ({ getValue }) => (
        <Chip color="accent" variant="primary">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.accessor("desc", {
      header: "接口描述",
      cell: ({ getValue }) => {
        const val = getValue();

        return val ? (
          <Tooltip delay={0}>
            <Tooltip.Trigger aria-label="Description">
              <span className="truncate">
                {val.length > 15 ? `${val.slice(0, 15)}...` : val}
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              <p>{val}</p>
            </Tooltip.Content>
          </Tooltip>
        ) : (
          "--"
        );
      },
    }),

    columnHelper.accessor((row) => row.category?.name ?? "--", {
      id: "category",
      header: "所属分类",
      cell: ({ getValue }) => (
        <Chip color="success" variant="soft">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.accessor("method", {
      header: "请求方法",
      cell: ({ getValue }) => (
        <Chip color="success" variant="soft">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.accessor("path", {
      header: "接口地址",
      cell: ({ getValue }) => (
        <Chip color="warning" variant="soft">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.accessor("operation_id", {
      header: "operationId",
      cell: ({ getValue }) => <Chip variant="secondary">{getValue()}</Chip>,
    }),

    columnHelper.accessor("sort", {
      header: "排序",
      cell: ({ getValue }) => (
        <Chip color="warning" variant="soft">
          {getValue()}
        </Chip>
      ),
    }),

    ...booleanColumns.map(({ key, header }) =>
      columnHelper.accessor(key, {
        header,
        cell: ({ getValue }) => (
          <Switch isReadOnly isSelected={getValue()}>
            {({ isSelected }) => (
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb>
                    <Switch.Icon>
                      {isSelected ? (
                        <Check className="size-3 text-inherit opacity-100" />
                      ) : (
                        <Xmark className="size-3 text-inherit opacity-70" />
                      )}
                    </Switch.Icon>
                  </Switch.Thumb>
                </Switch.Control>
              </Switch.Content>
            )}
          </Switch>
        ),
      }),
    ),

    columnHelper.accessor("created_at", {
      header: "创建时间",
      cell: ({ getValue }) => (
        <span className="text-muted text-xs">
          {dayjs(getValue()).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    }),

    columnHelper.accessor("updated_at", {
      header: "更新时间",
      cell: ({ getValue }) => (
        <span className="text-muted text-xs">
          {dayjs(getValue()).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false, // 序号/操作为功能性列，隐藏后模块失去入口
      header: "操作",
      cell: ({ row }) => (
        <div className="flex items-center justify-center min-w-25">
          <Button
            className="text-xs"
            size="sm"
            variant="ghost"
            onPress={() => handleEdit(row.original)}
          >
            <PencilToSquare />
            修改
          </Button>

          <Button
            className="text-xs text-danger hover:bg-danger-soft"
            size="sm"
            variant="ghost"
            onPress={() => handleDel(row.original)}
          >
            <TrashBin />
            删除
          </Button>
        </div>
      ),
    }),
  ];
}
