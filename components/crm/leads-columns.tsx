"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { LeadStatusBadge } from "@/components/crm/lead-status-badge"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import {
  LEAD_SOURCE_LABELS,
  LEAD_TYPE_LABELS,
  LEAD_STATUS_LABELS,
} from "@/lib/crm/lead-labels"
import { formatContactName } from "@/lib/crm/contact-display"
import { formatDatePl } from "@/lib/format/pl"
import type { CrmContact, DemoUser, Lead } from "@/types/crm"

export type LeadTableRow = Lead & {
  ownerName: string
  contactLabel: string | null
  _filter: string
}

type LeadsColumnsContext = {
  users: readonly DemoUser[]
  contacts: readonly CrmContact[]
  showOwnerColumn: boolean
  showCompanyColumn?: boolean
}

export function createLeadsColumns(
  ctx: LeadsColumnsContext,
): ColumnDef<LeadTableRow>[] {
  const showCompanyColumn = ctx.showCompanyColumn ?? true
  const columns: ColumnDef<LeadTableRow>[] = [
    createFilterSearchColumn<LeadTableRow>(),
    {
      accessorKey: "name",
      meta: { title: "Lead" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lead" />
      ),
      cell: ({ row }) => (
        <span className="max-w-56 truncate font-medium">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => LEAD_STATUS_LABELS[row.status],
      meta: { title: "Status" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <LeadStatusBadge status={row.original.status} />
      ),
      sortingFn: (a, b) =>
        LEAD_STATUS_LABELS[a.original.status].localeCompare(
          LEAD_STATUS_LABELS[b.original.status],
          "pl",
        ),
    },
    {
      id: "source",
      accessorFn: (row) => LEAD_SOURCE_LABELS[row.source],
      meta: { title: "Źródło" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Źródło" />
      ),
      cell: ({ row }) => LEAD_SOURCE_LABELS[row.original.source],
    },
    {
      id: "leadType",
      accessorFn: (row) =>
        row.leadType ? LEAD_TYPE_LABELS[row.leadType] : "—",
      meta: { title: "Typ" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ" />
      ),
      cell: ({ row }) =>
        row.original.leadType
          ? LEAD_TYPE_LABELS[row.original.leadType]
          : "—",
    },
  ]

  if (showCompanyColumn) {
    columns.push({
      accessorKey: "companyName",
      meta: { title: "Firma" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Firma" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">
          {row.original.companyName.trim() || "—"}
        </span>
      ),
      sortingFn: (a, b) =>
        a.original.companyName.localeCompare(b.original.companyName, "pl"),
    })
  }

  if (ctx.showOwnerColumn) {
    columns.push({
      accessorKey: "ownerName",
      meta: { title: "Opiekun" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Opiekun" />
      ),
      cell: ({ row }) => (
        <span className="truncate">{row.original.ownerName}</span>
      ),
    })
  }

  columns.push({
    accessorKey: "createdAt",
    meta: { title: "Utworzono" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Utworzono" />
    ),
    cell: ({ row }) => formatDatePl(row.original.createdAt),
    sortingFn: (a, b) =>
      new Date(a.original.createdAt).getTime() -
      new Date(b.original.createdAt).getTime(),
  })

  return columns
}

export function buildLeadTableRow(
  lead: Lead,
  users: readonly DemoUser[],
  contacts: readonly CrmContact[],
): LeadTableRow {
  const ownerName =
    users.find((u) => u.id === lead.ownerId)?.displayName ?? "—"
  const contact = lead.contactId
    ? contacts.find((c) => c.id === lead.contactId)
    : undefined
  const contactLabel = contact ? formatContactName(contact) : null
  const company = lead.companyName.trim()
  return {
    ...lead,
    ownerName,
    contactLabel,
    _filter: `${lead.name} ${company} ${contactLabel ?? ""} ${ownerName} ${LEAD_SOURCE_LABELS[lead.source]}`.toLowerCase(),
  }
}
