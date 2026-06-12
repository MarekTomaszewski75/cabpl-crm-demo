"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { TaskEditButton } from "@/components/crm/task-form-dialog"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import { TASK_PRIORITY_LABELS } from "@/lib/crm/task-labels"
import { formatDatePl } from "@/lib/format/pl"
import type { DemoUser, Task, TaskPriority } from "@/types/crm"

export type TaskTableRow = Task & {
  clientName: string | null
  opportunityTitle: string | null
  _filter: string
}

function priorityBadgeVariant(
  priority: TaskPriority,
): "destructive" | "secondary" | "outline" {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
  }
}

type TasksColumnsContext = {
  user: DemoUser
  onCompletedChange: (task: Task, checked: boolean) => void
}

export function createTasksColumns(
  ctx: TasksColumnsContext,
): ColumnDef<TaskTableRow>[] {
  return [
    createFilterSearchColumn<TaskTableRow>(),
    {
      id: "completed",
      meta: { title: "Wykonane" },
      header: () => <span className="sr-only">Wykonane</span>,
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.original.completed}
            onCheckedChange={(checked) =>
              ctx.onCompletedChange(row.original, checked === true)
            }
            aria-label={
              row.original.completed
                ? `Oznacz „${row.original.title}” jako niewykonane`
                : `Oznacz „${row.original.title}” jako wykonane`
            }
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      meta: { title: "Tytuł" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tytuł" />
      ),
      cell: ({ row }) => (
        <span
          className={
            row.original.completed
              ? "max-w-[16rem] truncate line-through"
              : "max-w-[16rem] truncate font-medium"
          }
        >
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      meta: { title: "Termin" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Termin" />
      ),
      cell: ({ row }) => formatDatePl(row.original.dueDate),
      sortingFn: (a, b) => {
        if (a.original.completed !== b.original.completed) {
          return a.original.completed ? 1 : -1
        }
        return (
          new Date(a.original.dueDate).getTime() -
          new Date(b.original.dueDate).getTime()
        )
      },
    },
    {
      accessorKey: "priority",
      meta: { title: "Priorytet" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priorytet" />
      ),
      cell: ({ row }) => (
        <Badge variant={priorityBadgeVariant(row.original.priority)}>
          {TASK_PRIORITY_LABELS[row.original.priority]}
        </Badge>
      ),
      sortingFn: (a, b) => {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.original.priority] - order[b.original.priority]
      },
    },
    {
      accessorKey: "clientName",
      meta: { title: "Klient" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Klient" />
      ),
      cell: ({ row }) =>
        row.original.clientId ? (
          <Link
            href={`/clients/${row.original.clientId}`}
            className="truncate hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.clientName ?? "—"}
          </Link>
        ) : (
          "—"
        ),
      sortingFn: (a, b) =>
        (a.original.clientName ?? "").localeCompare(
          b.original.clientName ?? "",
          "pl",
        ),
    },
    {
      accessorKey: "opportunityTitle",
      meta: { title: "Deal" },
      header: ({ column }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-fit">
              <DataTableColumnHeader column={column} title="Deal" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Deal sprzedażowy powiązany z zadaniem
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">
          {row.original.opportunityTitle ?? "—"}
        </span>
      ),
      sortingFn: (a, b) =>
        (a.original.opportunityTitle ?? "").localeCompare(
          b.original.opportunityTitle ?? "",
          "pl",
        ),
    },
    {
      id: "actions",
      meta: { title: "Akcje" },
      header: () => <span className="sr-only">Akcje</span>,
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <TaskEditButton user={ctx.user} task={row.original} />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
