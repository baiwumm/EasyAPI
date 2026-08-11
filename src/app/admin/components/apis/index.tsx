/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-23 15:24:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 14:07:06
 * @Description: 接口列表
 */
'use client'
import { CircleCheckFill } from '@gravity-ui/icons'
import { Card, toast, useOverlayState } from '@heroui/react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,

} from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

import DataTablePagination from '@/components/DataTablePagination'
import { RESPONSE } from '@/enums'
import { useRequest } from '@/hooks/use-request'
import { get } from '@/lib/utils'
import { delApi, getApisList } from '@/services/apis'
import { getCategorysList } from '@/services/categorys'

import { getColumns } from './components/columns'
import DataTable from './components/data-table'
import DeleteDialog from './components/delete-dialog'
import HeaderContent from './components/header-content'
import SaveModal from './components/save-modal'

import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { FC } from 'react'

// 初始参数
const InitialParams: App.ApiQueryParams = {
  pageIndex: 0,
  pageSize: 10,
  name: '',
  category_id: '',
}

const Apis: FC = () => {
  // 搜索参数
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const searchParams = useMemo<App.ApiQueryParams>(
    () => ({ name, category_id: categoryId, ...pagination }),
    [name, categoryId, pagination],
  )
  // 排序
  const [sorting, setSorting] = useState<SortingState>([])
  // 受控列
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    desc: false,
    vpn: false,
    commonlyUsed: false,
    updated_at: false,
  })

  // 保存弹窗
  const saveModalState = useOverlayState()
  // 删除弹窗
  const delDialogState = useOverlayState()
  // 编辑数据
  const [editData, setEditData] = useState<App.Api | null>(null)

  // 请求分类列表
  const { data: categorysList } = useRequest(async params => get<App.Category[]>(await getCategorysList(params), 'data.list', []), {
    defaultParams: [{ pageIndex: 0, pageSize: 999 }],
  })

  // 请求接口列表
  const { data, loading, run } = useRequest(async params => get(await getApisList(params), 'data', {}), {
    manual: true,
    defaultParams: [searchParams],
  })
  const total = get(data, 'total', 0)

  // 发起请求
  const handleSearch = () => {
    run(searchParams)
  }

  // 重置
  const handleReset = () => {
    setName('')
    setCategoryId('')
    setPagination({ pageIndex: 0, pageSize: 10 })
    run(InitialParams)
  }

  // 编辑回调
  const handleEdit = useCallback((row: App.Api) => {
    setEditData(row)
    saveModalState.open()
  }, [saveModalState])

  // 删除接口
  const { loading: delLoading, run: fetchDelApi } = useRequest(delApi, {
    manual: true,
    onSuccess: ({ code }) => {
      if (code === RESPONSE.SUCCESS) {
        delDialogState.close()
        toast.success('删除成功', {
          timeout: 2000,
          indicator: <CircleCheckFill />,
        })
        handleSearch()
      }
    },
  })

  // 删除回调
  const handleDel = useCallback((row: App.Api) => {
    setEditData(row)
    delDialogState.open()
  }, [delDialogState])

  // 确认删除回调
  const handleDelConfirm = () => {
    if (editData?.id) {
      fetchDelApi(editData.id)
    }
  }

  // 列配置项
  const columns = useMemo(
    () => getColumns({ handleEdit, handleDel, page: get(data, 'page', 0), pageSize: get(data, 'pageSize', 0) }),
    [handleEdit, handleDel, data],
  )

  // 表格实例
  const table = useReactTable({
    data: get(data, 'list', []),
    columns,
    pageCount: Math.ceil((total || 0) / searchParams.pageSize),
    getRowId: (row: App.Api) => row.id,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    defaultColumn: {
      enableSorting: false, // 默认全部不能排序
    },
  })

  useEffect(() => {
    run(searchParams)
  }, [run, searchParams.pageIndex, searchParams.pageSize])

  useEffect(() => {
    if (!saveModalState.isOpen) {
      setEditData(null)
    }
  }, [saveModalState.isOpen])

  useEffect(() => {
    if (!delDialogState.isOpen) {
      setEditData(null)
    }
  }, [delDialogState.isOpen])
  return (
    <>
      <Card className="shadow-lg">
        <HeaderContent
          name={name}
          categoryId={categoryId}
          categorysList={categorysList || []}
          handleReset={handleReset}
          handleSearch={handleSearch}
          loading={loading}
          saveModalState={saveModalState}
          setCategoryId={setCategoryId}
          setName={setName}
          table={table}
        />
        <Card.Content>
          <DataTable loading={loading} table={table} />
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
      <DeleteDialog handleDelConfirm={handleDelConfirm} loading={delLoading} state={delDialogState} />
    </>
  )
}
export default Apis
