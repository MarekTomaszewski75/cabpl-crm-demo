"use client"

import type { Table } from "@tanstack/react-table"
import { LayersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GROUPING_NONE = "__none__"

export type DataTableGroupingOption = {
  columnId: string
  label: string
}

interface DataTableGroupingProps<TData> {
  table: Table<TData>
  options: DataTableGroupingOption[]
}

export function DataTableGrouping<TData>({
  table,
  options,
}: DataTableGroupingProps<TData>) {
  if (options.length === 0) {
    return null
  }

  const activeId = table.getState().grouping[0] ?? GROUPING_NONE

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Grupowanie"
        >
          <LayersIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Grupuj według</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeId}
          onValueChange={(value) => {
            table.setGrouping(value === GROUPING_NONE ? [] : [value])
            if (value !== GROUPING_NONE) {
              table.setExpanded(true)
            }
          }}
        >
          <DropdownMenuRadioItem value={GROUPING_NONE}>
            Bez grupowania
          </DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.columnId}
              value={option.columnId}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
