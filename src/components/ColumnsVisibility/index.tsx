/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:48:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-05 15:36:57
 * @Description: 表格列设置
 */
import type { Selection } from "@heroui/react";
import type { RowData } from "@tanstack/react-table";
import type { AppTable } from "@/typings/table-types";

import { Sliders } from "@gravity-ui/icons";
import { Button, Dropdown, Label } from "@heroui/react";

function ColumnsVisibility<TData extends RowData>({
  table,
}: {
  table: AppTable<TData>;
}) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  const selectedKeys = new Set(
    columns.filter((c) => c.getIsVisible()).map((c) => c.id),
  );

  const handleSelectionChange = (keys: Selection) => {
    const visibleIds = new Set(Array.from(keys));

    // D20：合并为一次批量 set。原先对每列调 toggleVisibility（O(N) 次状态写入），
    // 现在函数式 updater 单轮经 onColumnVisibilityChange 同步；隐藏条目缺省即
    // 可见（v9 语义），enableHiding: false 的功能列不在可隐藏集合内不受影响
    table.setColumnVisibility((old) => ({
      ...old,
      ...Object.fromEntries(
        columns.map((column) => [column.id, visibleIds.has(column.id)]),
      ),
    }));
  };

  return (
    <Dropdown>
      <Button size="sm" variant="outline">
        <Sliders />
        列设置
      </Button>
      <Dropdown.Popover className="min-w-37.5">
        <Dropdown.Menu
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
        >
          {columns.map((column) => (
            <Dropdown.Item
              key={column.id}
              className="capitalize"
              id={column.id}
            >
              <Dropdown.ItemIndicator />
              <Label>{column.columnDef?.header as string}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default ColumnsVisibility;
