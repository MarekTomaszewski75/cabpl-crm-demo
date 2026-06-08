"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import { employeeStatusBadgeVariant } from "@/lib/crm/employee-labels"
import {
  EMPLOYEE_STATUS_LABELS,
  USER_ROLE_LABELS,
} from "@/types/crm"
import type { Employee, UserRole } from "@/types/crm"

export type EmployeeTableRow = Employee & {
  fullName: string
  departmentName: string
  managerName: string | null
  rolesLabel: string
  _filter: string
}

export function createEmployeesColumns(): ColumnDef<EmployeeTableRow>[] {
  return [
    createFilterSearchColumn<EmployeeTableRow>(),
    {
      accessorKey: "fullName",
      meta: { title: "Pracownik" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pracownik" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.fullName}</span>
      ),
    },
    {
      accessorKey: "position",
      meta: { title: "Stanowisko" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stanowisko" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate text-muted-foreground">
          {row.original.position}
        </span>
      ),
    },
    {
      accessorKey: "departmentName",
      meta: { title: "Dział" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dział" />
      ),
    },
    {
      id: "managerName",
      accessorFn: (row) => row.managerName ?? "—",
      meta: { title: "Kierownik" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kierownik" />
      ),
      cell: ({ row }) => row.original.managerName ?? "—",
    },
    {
      accessorKey: "rolesLabel",
      meta: { title: "Role CRM" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role CRM" />
      ),
      cell: ({ row }) => (
        <span className="max-w-56 truncate text-sm">{row.original.rolesLabel}</span>
      ),
    },
    {
      accessorKey: "status",
      meta: { title: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={employeeStatusBadgeVariant(row.original.status)}>
          {EMPLOYEE_STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
  ]
}

export function formatRolesLabel(roles: UserRole[]): string {
  return roles.map((r) => USER_ROLE_LABELS[r]).join(", ")
}
