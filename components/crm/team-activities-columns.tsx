"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import {
  TEAM_ACTIVITY_ENTITY_LABELS,
  type TeamActivityRow,
} from "@/lib/crm/team-activities"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"

export function createTeamActivitiesColumns(): ColumnDef<TeamActivityRow>[] {
  return [
    createFilterSearchColumn<TeamActivityRow>(),
    {
      accessorKey: "occurredAt",
      meta: { title: "Data" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap tabular-nums">
          <span>{formatDatePl(row.original.occurredAt)}</span>{" "}
          <span className="text-muted-foreground">
            {formatTimePl(row.original.occurredAt)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      meta: { title: "Aktywność" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Aktywność" />
      ),
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{row.original.title}</p>
          {row.original.note ? (
            <p className="truncate text-xs text-muted-foreground">
              {row.original.note}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "entityType",
      accessorFn: (row) => TEAM_ACTIVITY_ENTITY_LABELS[row.entityType],
      meta: { title: "Typ" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {TEAM_ACTIVITY_ENTITY_LABELS[row.original.entityType]}
        </Badge>
      ),
    },
    {
      accessorKey: "entityName",
      meta: { title: "Powiązanie" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Powiązanie" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">{row.original.entityName}</span>
      ),
    },
    {
      accessorKey: "ownerName",
      meta: { title: "Opiekun" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Opiekun" />
      ),
      cell: ({ row }) => (
        <span className="max-w-36 truncate">{row.original.ownerName}</span>
      ),
    },
  ]
}
