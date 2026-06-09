"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DealStatusBadge } from "@/components/crm/deal-status-badge"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import {
  DEAL_SOURCE_LABELS,
  DEAL_STATUS_LABELS,
  DEAL_TYPE_LABELS,
} from "@/lib/crm/deal-labels"
import { formatContactName } from "@/lib/crm/contact-display"
import { formatCurrencyPln, formatDatePl } from "@/lib/format/pl"
import type { Client, CrmContact, Deal, DemoUser } from "@/types/crm"

export type DealTableRow = Deal & {
  ownerName: string
  clientName: string
  contactLabel: string | null
  _filter: string
}

type DealsColumnsContext = {
  showOwnerColumn: boolean
}

export function createDealsColumns(
  ctx: DealsColumnsContext,
): ColumnDef<DealTableRow>[] {
  const columns: ColumnDef<DealTableRow>[] = [
    createFilterSearchColumn<DealTableRow>(),
    {
      accessorKey: "name",
      meta: { title: "Deal" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deal" />
      ),
      cell: ({ row }) => (
        <span className="max-w-56 truncate font-medium">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => DEAL_STATUS_LABELS[row.status],
      enableGrouping: true,
      meta: { title: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <DealStatusBadge status={row.original.status} />,
      sortingFn: (a, b) =>
        DEAL_STATUS_LABELS[a.original.status].localeCompare(
          DEAL_STATUS_LABELS[b.original.status],
          "pl",
        ),
    },
    {
      id: "amount",
      accessorFn: (row) => row.amount ?? 0,
      meta: { title: "Kwota" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kwota" />
      ),
      cell: ({ row }) =>
        row.original.amount === null
          ? "—"
          : formatCurrencyPln(row.original.amount),
    },
    {
      id: "source",
      accessorFn: (row) => (row.source ? DEAL_SOURCE_LABELS[row.source] : "—"),
      enableGrouping: true,
      meta: { title: "Źródło" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Źródło" />
      ),
      cell: ({ row }) =>
        row.original.source ? DEAL_SOURCE_LABELS[row.original.source] : "—",
    },
    {
      id: "dealType",
      accessorFn: (row) => (row.dealType ? DEAL_TYPE_LABELS[row.dealType] : "—"),
      enableGrouping: true,
      meta: { title: "Typ" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ" />
      ),
      cell: ({ row }) =>
        row.original.dealType ? DEAL_TYPE_LABELS[row.original.dealType] : "—",
    },
    {
      accessorKey: "clientName",
      enableGrouping: true,
      meta: { title: "Firma" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Firma" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">
          {row.original.clientName.trim() || "—"}
        </span>
      ),
      sortingFn: (a, b) =>
        a.original.clientName.localeCompare(b.original.clientName, "pl"),
    },
  ]

  if (ctx.showOwnerColumn) {
    columns.push({
      accessorKey: "ownerName",
      enableGrouping: true,
      meta: { title: "Opiekun" },
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

export function buildDealTableRow(
  deal: Deal,
  users: readonly DemoUser[],
  contacts: readonly CrmContact[],
  clients: readonly Client[] = [],
): DealTableRow {
  const ownerName =
    users.find((u) => u.id === deal.ownerId)?.displayName ?? "—"
  const contact = deal.contactId
    ? contacts.find((c) => c.id === deal.contactId)
    : undefined
  const contactLabel = contact ? formatContactName(contact) : null
  const clientName = deal.clientId
    ? (clients.find((c) => c.id === deal.clientId)?.name ?? "")
    : ""
  return {
    ...deal,
    ownerName,
    clientName,
    contactLabel,
    _filter: `${deal.name} ${ownerName} ${contactLabel ?? ""} ${clientName}`.toLowerCase(),
  }
}
