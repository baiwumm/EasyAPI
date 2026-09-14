/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 14:07:06
 * @Description: 接口列表
 */
"use client";
import type { AppTableFeatures } from "@/typings/table-types";
import type { Api, ApiQueryParams, Category } from "@/typings";
import type {
  ColumnVisibilityState,
  PaginationState,
} from "@tanstack/react-table";
import type { FC } from "react";

import { CircleCheckFill } from "@gravity-ui/icons";
import { Card, toast, useOverlayState } from "@heroui/react";
import { useTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getColumns } from "./components/columns";
import HeaderContent from "./components/header-content";
import SaveModal from "./components/save-modal";

import AdminDataTable from "@/components/AdminDataTable";
import AdminDeleteDialog from "@/components/AdminDeleteDialog";
import DataTablePagination from "@/components/DataTablePagination";
import { RESPONSE } from "@/enums";
import { useSwrMutation, useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { delApi, getApisList } from "@/services/apis";
import { getCategorysList } from "@/services/categorys";
import { appTableFeatures } from "@/typings/table-types";

const Apis: FC = () => {
  // 搜索参数（输入框值）
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  // 已提交的查询条件：只有点击查询/重置时才更新，输入框变化不触发请求
  const [query, setQuery] = useState<
    Pick<ApiQueryParams, "name" | "category_id">
  >({ name: "", category_id: "" });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const searchParams = useMemo<ApiQueryParams>(
    () => ({ ...query, ...pagination }),
    [query, pagination],
  );
  // 受控列
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({
      desc: false,
      updated_at: false,
    });

  // 保存弹窗
  const saveModalState = useOverlayState();
  // 删除弹窗
  const delDialogState = useOverlayState();
  // 编辑数据
  const [editData, setEditData] = useState<Api | null>(null);

  // 请求分类列表
  const { data: categorysList } = useSwrQuery(
    "/categorys:list", // 固定 key + 独立前缀，避免与列表查询 key 互相覆盖缓存
    async () =>
      get<Category[]>(
        await getCategorysList({ pageIndex: 0, pageSize: 999 }),
        "data.list",
        [],
      ),
  );

  // 请求接口列表：key 含搜索/分页参数，变化自动请求
  const { data, loading, mutate } = useSwrQuery(
    ["/apis", searchParams],
    async () => get(await getApisList(searchParams), "data", {}),
    { keepPreviousData: true }, // 翻页保留旧数据，不闪空
  );
  const total = get(data, "total", 0);

  // 发起请求（搜索时回到第一页，避免停留在超出新结果范围的页码）
  const handleSearch = () => {
    setQuery({ name, category_id: categoryId });
    setPagination((p) => (p.pageIndex === 0 ? p : { ...p, pageIndex: 0 }));
    // 搜索词与分页都没变时 key 不变，SWR 不会发请求 → 手动刷新
    if (
      name === query.name &&
      categoryId === query.category_id &&
      pagination.pageIndex === 0
    ) {
      mutate();
    }
  };

  // 重置
  const handleReset = () => {
    setName("");
    setCategoryId("");
    setQuery({ name: "", category_id: "" });
    setPagination({ pageIndex: 0, pageSize: 10 });
    // 重置后 key 未变（已是空查询 + 第一页 + 默认 pageSize）时手动刷新
    // 需含 pageSize 判断：pageSize 变化本身会因 key 改变触发请求，再 mutate 会双请求竞态
    if (
      query.name === "" &&
      query.category_id === "" &&
      pagination.pageIndex === 0 &&
      pagination.pageSize === 10
    ) {
      mutate();
    }
  };

  // 编辑回调
  const handleEdit = useCallback(
    (row: Api) => {
      setEditData(row);
      saveModalState.open();
    },
    [saveModalState.open], // open 引用稳定，聚合对象每次渲染都是新引用
  );

  // 删除接口
  const { loading: delLoading, trigger: fetchDelApi } = useSwrMutation(
    "/apis:delete",
    delApi,
    {
      onSuccess: ({ code }) => {
        if (code === RESPONSE.SUCCESS) {
          delDialogState.close();
          toast.success("删除成功", {
            timeout: 2000,
            indicator: <CircleCheckFill />,
          });
          // 删除的是当前页最后一条时先回退一页，避免滞留在越界空页
          const list = get(data, "list", []) as Api[];

          if (list.length <= 1 && pagination.pageIndex > 0) {
            setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }));
          } else {
            handleSearch(); // 参数未变时内部走 mutate()，列表必然刷新
          }
        }
      },
    },
  );

  // 删除回调
  const handleDel = useCallback(
    (row: Api) => {
      setEditData(row);
      delDialogState.open();
    },
    [delDialogState.open], // open 引用稳定，聚合对象每次渲染都是新引用
  );

  // 确认删除回调
  const handleDelConfirm = () => {
    if (editData?.id) {
      fetchDelApi(editData.id);
    }
  };

  // 列配置项（依赖原始值，避免每次响应都重建列定义）
  const page = get(data, "page", 0);
  const pageSize = get(data, "pageSize", 0);
  const columns = useMemo(
    () => getColumns({ handleEdit, handleDel, page, pageSize }),
    [handleEdit, handleDel, page, pageSize],
  );

  // 表格实例
  const table = useTable({
    features: appTableFeatures as AppTableFeatures,
    data: get(data, "list", []),
    columns,
    pageCount: Math.ceil((total || 0) / searchParams.pageSize),
    getRowId: (row: Api) => row.id,
    state: {
      pagination,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    defaultColumn: {
      enableSorting: false, // 默认全部不能排序
    },
  });

  // 分页变化由 key 驱动自动请求，无需手动 run

  /* eslint-disable react-hooks/set-state-in-effect */
  // 当弹窗关闭时清除编辑数据（useOverlayState 无 onClose 回调，需通过 effect 同步）
  useEffect(() => {
    if (!saveModalState.isOpen) {
      setEditData(null);
    }
  }, [saveModalState.isOpen]);

  useEffect(() => {
    if (!delDialogState.isOpen) {
      setEditData(null);
    }
  }, [delDialogState.isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <>
      <Card className="shadow-lg">
        <HeaderContent
          categoryId={categoryId}
          categorysList={categorysList || []}
          handleReset={handleReset}
          handleSearch={handleSearch}
          loading={loading}
          name={name}
          saveModalState={saveModalState}
          setCategoryId={setCategoryId}
          setName={setName}
          table={table}
        />
        <Card.Content>
          <AdminDataTable
            ariaLabel="接口列表"
            loading={loading}
            table={table}
          />
        </Card.Content>
        <Card.Footer>
          <DataTablePagination table={table} total={total || 0} />
        </Card.Footer>
      </Card>
      {/* 保存弹窗 */}
      <SaveModal
        categorysList={categorysList || []}
        handleRefresh={handleSearch}
        initialValues={editData}
        state={saveModalState}
      />
      {/* 删除弹窗 */}
      <AdminDeleteDialog
        entity="接口"
        handleDelConfirm={handleDelConfirm}
        loading={delLoading}
        state={delDialogState}
      />
    </>
  );
};

export default Apis;
