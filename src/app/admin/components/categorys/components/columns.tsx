"use client";

import type { AppTableFeatures } from "@/typings/table-types";
import type { Category } from "@/typings";

import { PencilToSquare, TrashBin } from "@gravity-ui/icons";
import { Button, Chip, Tooltip } from "@heroui/react";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<AppTableFeatures, Category>();

interface ColumnsProps {
  handleEdit: (row: Category) => void;
  handleDel: (row: Category) => void;
  page: number;
  pageSize: number;
}

export function getColumns({
  handleEdit,
  handleDel,
  page = 1,
  pageSize = 10,
}: ColumnsProps) {
  return [
    columnHelper.display({
      id: "index",
      header: "序号",
      cell: ({ row }) => <Chip>{(page - 1) * pageSize + row.index + 1}</Chip>,
    }),

    columnHelper.accessor("name", {
      header: "分类名称",
      cell: ({ getValue }) => (
        <Chip color="accent" variant="primary">
          {getValue()}
        </Chip>
      ),
    }),

    columnHelper.accessor("apis", {
      header: "接口个数",
      cell: ({ getValue }) => (
        <Chip color="accent" variant="soft">
          {getValue()?.length || 0}
        </Chip>
      ),
    }),

    columnHelper.accessor("desc", {
      header: "分类描述",
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

    columnHelper.accessor("sort", {
      header: "排序",
      cell: ({ getValue }) => (
        <Chip color="warning" variant="soft">
          {getValue()}
        </Chip>
      ),
    }),

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
