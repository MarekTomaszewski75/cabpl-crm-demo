"use client"

import type { Table } from "@tanstack/react-table"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DataTableGrouping,
  type DataTableGroupingOption,
} from "@/components/data-table/data-table-grouping"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterPlaceholder?: string
  /** Faceted filters — między wyszukiwarką a opcjami kolumn. */
  toolbarFilters?: React.ReactNode
  showSearch?: boolean
  groupingOptions?: DataTableGroupingOption[]
}

export function DataTableToolbar<TData>({
  table,
  filterPlaceholder = "Szukaj…",
  toolbarFilters,
  showSearch = true,
  groupingOptions,
}: DataTableToolbarProps<TData>) {
  const filterColumn = table.getColumn("_filter")
  const showSearchField = showSearch && filterColumn
  const hasLeadingToolbar = showSearchField || Boolean(toolbarFilters)

  return (
    <div
      className={
        hasLeadingToolbar
          ? "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          : "flex justify-end"
      }
    >
      {hasLeadingToolbar ? (
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {showSearchField ? (
          <div className="relative w-full min-w-[12rem] sm:max-w-xs sm:flex-1">
            <SearchIcon
              data-icon="inline-start"
              className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder={filterPlaceholder}
              value={(filterColumn.getFilterValue() as string) ?? ""}
              onChange={(e) => filterColumn.setFilterValue(e.target.value)}
              className="pl-8"
              aria-label={filterPlaceholder}
            />
          </div>
        ) : null}
        {toolbarFilters}
      </div>
      ) : null}
      <div className="flex items-center justify-end gap-1">
        {groupingOptions ? (
          <DataTableGrouping table={table} options={groupingOptions} />
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
