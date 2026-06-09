"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type GroupingState,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DataTableGroupingOption } from "@/components/data-table/data-table-grouping"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { cn } from "@/lib/utils"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    title?: string
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterPlaceholder?: string
  emptyMessage?: string
  pageSize?: number
  initialSorting?: SortingState
  onRowClick?: (row: TData) => void
  getRowClassName?: (row: TData) => string | undefined
  showToolbar?: boolean
  toolbarFilters?: React.ReactNode
  /** Wyszukiwarka w toolbarze tabeli (domyślnie tak). */
  showSearchInToolbar?: boolean
  /** Opcje grupowania (TanStack grouping) — przycisk z ikoną warstw w toolbarze. */
  groupingOptions?: DataTableGroupingOption[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterPlaceholder,
  emptyMessage = "Brak wyników.",
  pageSize = 10,
  initialSorting = [],
  onRowClick,
  getRowClassName,
  showToolbar = true,
  toolbarFilters,
  showSearchInToolbar = true,
  groupingOptions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      _filter: false,
    })
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>(true)
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [data, columnFilters, sorting, grouping])

  const columnVisibilityWithGrouping = React.useMemo(() => {
    const visibility: VisibilityState = { ...columnVisibility, _filter: false }
    for (const columnId of grouping) {
      visibility[columnId] = false
    }
    return visibility
  }, [columnVisibility, grouping])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: (updater) => {
      setGrouping(updater)
      setExpanded(true)
    },
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      expanded: true,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility: columnVisibilityWithGrouping,
      grouping,
      expanded,
      pagination,
    },
  })

  const visibleLeafColumnCount = table
    .getVisibleLeafColumns()
    .filter((column) => column.id !== "_filter").length

  function renderGroupedRow(row: Row<TData>) {
    const groupingColumnId = row.groupingColumnId
    if (!groupingColumnId) {
      return null
    }

    const value = row.getGroupingValue(groupingColumnId)
    const displayValue =
      value === null || value === undefined || value === ""
        ? "—"
        : String(value)

    return (
      <TableRow key={row.id} className="bg-muted/40 hover:bg-muted/50">
        <TableCell colSpan={visibleLeafColumnCount} className="py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 font-normal"
            onClick={row.getToggleExpandedHandler()}
          >
            <ChevronRightIcon
              className={cn(
                "size-4 shrink-0 transition-transform",
                row.getIsExpanded() && "rotate-90",
              )}
            />
            <span>
              <span className="font-medium">{displayValue}</span>
              <span className="text-muted-foreground">
                {" "}
                ({row.subRows.length})
              </span>
            </span>
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  const toolbarGap =
    showToolbar && !showSearchInToolbar && !toolbarFilters ? "gap-2" : "gap-4"

  return (
    <div className={cn("flex flex-col", toolbarGap)}>
      {showToolbar ? (
        <DataTableToolbar
          table={table}
          filterPlaceholder={filterPlaceholder}
          toolbarFilters={toolbarFilters}
          showSearch={showSearchInToolbar}
          groupingOptions={groupingOptions}
        />
      ) : null}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.column.id === "_filter") {
                    return null
                  }
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                if (row.getIsGrouped()) {
                  return renderGroupedRow(row)
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      getRowClassName?.(row.original),
                    )}
                    onClick={
                      onRowClick
                        ? () => onRowClick(row.original)
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "_filter") {
                        return null
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            (cell.column.id === "fullName" ||
                              cell.column.id === "name") &&
                              row.depth > 0 &&
                              "pl-8",
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    table
                      .getVisibleLeafColumns()
                      .filter((c) => c.id !== "_filter").length
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
