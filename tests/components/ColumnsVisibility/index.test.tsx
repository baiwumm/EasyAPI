// @vitest-environment jsdom
/*
 * D20：列设置的选区变更合并为一次 setColumnVisibility 批量写入。
 * 回归点：一次勾选/取消只触发一次 onColumnVisibilityChange（此前每列一次，
 * O(N) 次状态写入），且表格可见性状态正确、其余列不受影响。
 * harness 与管理页一致：state.columnVisibility 受控 + onColumnVisibilityChange
 * 接 React useState
 */
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";

import ColumnsVisibility from "@/components/ColumnsVisibility";
import {
  appTableFeatures,
  type AppColumnDef,
  type AppTable,
} from "@/typings/table-types";

type Row = { name: string; desc: string };
type VisibilityUpdater =
  | Record<string, boolean>
  | ((current: Record<string, boolean>) => Record<string, boolean>);

const ROWS: Row[] = [{ name: "随机头像", desc: "生成随机头像" }];

const COLUMNS: AppColumnDef<Row>[] = [
  { accessorKey: "name", header: "名称" },
  { accessorKey: "desc", header: "描述" },
];

beforeAll(() => {
  // React Aria 依赖 Pointer Capture / scrollIntoView，jsdom 未实现
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterEach(cleanup);

function createHarness() {
  const onColumnVisibilityChange = vi.fn();
  let tableRef: AppTable<Row> | null = null;

  function Harness() {
    const [visibility, setVisibility] = useState<Record<string, boolean>>({});
    const table = useTable({
      features: appTableFeatures as typeof appTableFeatures,
      data: ROWS,
      columns: COLUMNS,
      state: { columnVisibility: visibility },
      onColumnVisibilityChange: (updater: VisibilityUpdater) => {
        onColumnVisibilityChange(updater);
        setVisibility((current) =>
          typeof updater === "function" ? updater(current) : updater,
        );
      },
    });

    useEffect(() => {
      tableRef = table;
    });

    return <ColumnsVisibility table={table} />;
  }

  return { Harness, onColumnVisibilityChange, getTable: () => tableRef };
}

describe("ColumnsVisibility 批量写回", () => {
  it("一次勾选变更只触发一次 onColumnVisibilityChange，且状态正确", async () => {
    const user = userEvent.setup();
    const { Harness, onColumnVisibilityChange } = createHarness();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "列设置" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "名称" }));

    // O(N) → O(1)：两列场景下此前每列写一次状态，现在整批只写一次
    expect(onColumnVisibilityChange).toHaveBeenCalledTimes(1);
    // updater 收到旧状态并返回整批新状态
    const updater = onColumnVisibilityChange.mock.calls[0][0] as (
      current: Record<string, boolean>,
    ) => Record<string, boolean>;

    expect(updater({ name: true, desc: true })).toEqual({
      name: false,
      desc: true,
    });
  });

  it("取消勾选隐藏列、再勾选恢复可见，其余列不受影响", async () => {
    const user = userEvent.setup();
    let latest: Record<string, boolean> = {};

    function Harness() {
      const [visibility, setVisibility] = useState<Record<string, boolean>>({});
      const table = useTable({
        features: appTableFeatures as typeof appTableFeatures,
        data: ROWS,
        columns: COLUMNS,
        state: { columnVisibility: visibility },
        onColumnVisibilityChange: (updater: VisibilityUpdater) => {
          setVisibility((current) => {
            const next =
              typeof updater === "function" ? updater(current) : updater;
            latest = next;

            return next;
          });
        },
      });

      return <ColumnsVisibility table={table} />;
    }

    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "列设置" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "名称" }));
    expect(latest).toEqual({ name: false, desc: true });

    // 菜单保持打开（多选语义），同一项可再次勾选恢复
    await user.click(screen.getByRole("menuitemcheckbox", { name: "名称" }));
    expect(latest).toEqual({ name: true, desc: true });
  });
});
