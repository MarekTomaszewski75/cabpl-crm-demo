"use client"

import type { Table } from "@tanstack/react-table"
import { Columns3CogIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

function columnLabel<TData>(
  table: Table<TData>,
  columnId: string,
): string {
  const column = table.getColumn(columnId)
  const meta = column?.columnDef.meta as { title?: string } | undefined
  return meta?.title ?? columnId
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const hideable = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" &&
        column.getCanHide() &&
        column.id !== "_filter",
    )

  if (hideable.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Kolumny"
        >
          <Columns3CogIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Widoczne kolumny</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {hideable.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {columnLabel(table, column.id)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
