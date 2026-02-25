"use client"
import { Check, PencilToSquare, TrashBin, Xmark } from '@gravity-ui/icons';
import { Button, Chip, Switch, Tooltip } from "@heroui/react";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from 'dayjs';

type ColumnsProps = {
  handleEdit: (row: App.Api) => void;
  handleDel: (row: App.Api) => void;
  page: number;
  pageSize: number;
}

export const getColumns = ({ handleEdit, handleDel, page = 1, pageSize = 10 }: ColumnsProps): ColumnDef<App.Api>[] => {
  return [
    {
      accessorKey: "index",
      header: '序号',
      cell: ({ row }) => <Chip className="rounded-full">{(page - 1) * pageSize + row.index + 1}</Chip>
    },
    {
      accessorKey: "name",
      header: '接口名称',
      cell: ({ getValue }) => <Chip color="accent" variant='primary' className="rounded-full">{getValue<string>()}</Chip>
    },
    {
      accessorKey: "desc",
      header: '接口描述',
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return val ? (
          (
            <Tooltip delay={0}>
              <Tooltip.Trigger aria-label="Description">
                <span className="truncate">{val.length > 15 ? `${val.slice(0, 15)}...` : val}</span>
              </Tooltip.Trigger>
              <Tooltip.Content showArrow>
                <Tooltip.Arrow />
                <p>{getValue<string>()}</p>
              </Tooltip.Content>
            </Tooltip>
          )
        ) : '--'
      }
    },
    {
      accessorKey: "category",
      header: '所属分类',
      cell: ({ row }) => <Chip color='success' variant='soft' className="rounded-full">{row.original.category.name}</Chip>
    },
    {
      accessorKey: "method",
      header: '请求方法',
      cell: ({ getValue }) => <Chip color='success' variant='soft' className="rounded-full">{getValue<string>()}</Chip>
    },
    {
      accessorKey: "path",
      header: '接口地址',
      cell: ({ getValue }) => <Chip color='warning' variant='soft' className="rounded-full">{getValue<string>()}</Chip>
    },
    {
      accessorKey: "operation_id",
      header: 'operationId',
      cell: ({ getValue }) => <Chip variant='secondary' className="rounded-full">{getValue<string>()}</Chip>
    },
    {
      accessorKey: "sort",
      header: '排序',
      cell: ({ getValue }) => <Chip color="warning" variant='soft' className="rounded-full">{getValue<number>()}</Chip>
    },
    ...[
      { accessorKey: "pinned", header: '置顶' },
      { accessorKey: "is_featured", header: '推荐' },
    ].map<ColumnDef<App.Api>>(({ accessorKey, header }) => ({
      accessorKey,
      header,
      cell: ({ getValue }) => (
        <Switch isSelected={getValue<boolean>()} isReadOnly>
          {({ isSelected }) => (
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
          )}
        </Switch>
      )
    })),
    {
      accessorKey: "created_at",
      header: '创建时间',
      cell: ({ row }) => <span className="text-muted text-xs">{dayjs(row.original.created_at).format('YYYY-MM-DD HH:mm')}</span>
    },
    {
      accessorKey: "updated_at",
      header: '更新时间',
      cell: ({ row }) => <span className="text-muted text-xs">{dayjs(row.original.updated_at).format('YYYY-MM-DD HH:mm')}</span>
    },
    {
      accessorKey: "actions",
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center justify-center min-w-25">
          <Button size='sm' variant='ghost' className="text-xs" onPress={() => handleEdit(row.original)}>
            <PencilToSquare />
            修改
          </Button>
          <Button
            size='sm'
            variant="ghost"
            className="text-xs text-danger hover:bg-danger-soft"
            onPress={() => handleDel(row.original)}
          >
            <TrashBin />
            删除
          </Button>
        </div>
      )
    }
  ]
}