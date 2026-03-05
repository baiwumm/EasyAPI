/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-28 09:01:56
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-25 16:08:08
 * @Description: 数据表格
 */
import { ChevronUp } from '@gravity-ui/icons';
import { cn, Spinner, Table } from "@heroui/react";
import { flexRender, type Table as TableInstance } from '@tanstack/react-table';
import { type FC } from 'react';

import EmptyContent from '@/components/EmptyContent';
import { ADMIN_TABS } from '@/enums';

type DataTableProps = {
  table: TableInstance<App.Api>;
  loading: boolean;
}

const DataTable: FC<DataTableProps> = ({ table, loading = false }) => {
  return (
    <div className="relative">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={ADMIN_TABS.label(ADMIN_TABS.APIS)}>
            <Table.Header>
              {table.getHeaderGroups()[0]!.headers.map((header) => {
                const sortDirection = header.column.getIsSorted()
                return (
                  <Table.Column
                    key={header.id}
                    allowsSorting={header.column.getCanSort()}
                    id={header.id}
                    isRowHeader
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sortDirection && (
                        <ChevronUp
                          className={cn(
                            "size-3 transform transition-transform duration-100 ease-out",
                            sortDirection === "desc" ? "rotate-180" : "",
                          )}
                        />
                      )}
                    </div>
                  </Table.Column>
                )
              })}
            </Table.Header>
            <Table.Body renderEmptyState={() => <EmptyContent />}>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id} id={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px] pointer-events-auto">
          <Spinner />
        </div>
      )}
    </div>
  )
}
export default DataTable;