'use client'

import type {
  ColumnDef,
  ReactTable,
  Row,
  RowData,
} from '@tanstack/react-table'

import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'

export const appTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

export type AppColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  AppTableFeatures,
  TData,
  TValue
>

export type AppRow<TData extends RowData> = Row<AppTableFeatures, TData>

export type AppTable<TData extends RowData> = ReactTable<
  AppTableFeatures,
  TData
>

export type AppTableFeatures = typeof appTableFeatures
