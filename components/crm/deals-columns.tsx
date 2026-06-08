"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import {
  DEAL_SOURCE_LABELS,
  DEAL_STATUS_LABELS,
  DEAL_TYPE_LABELS,
  dealStatusBadgeVariant,
} from "@/lib/crm/deal-labels"
import { formatContactName } from "@/lib/crm/contact-display"
import { formatCurrencyPln, formatDatePl } from "@/lib/format/pl"
import type { Client, CrmContact, Deal, DemoUser } from "@/types/crm"

export type DealTableRow = Deal & {
  ownerName: string
  contactLabel: string | null
  _filter: string
}

export function createDealsColumns(): ColumnDef<DealTableRow>[] {
  return [
    createFilterSearchColumn<DealTableRow>(),
    {
      accessorKey: "name",
      meta: { title: "Deal" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deal" />,
      cell: ({ row }) => <span className="max-w-56 truncate font-medium">{row.original.name}</span>,
    },
    {
      id: "status",
      accessorFn: (row) => DEAL_STATUS_LABELS[row.status],
      enableGrouping: true,
      meta: { title: "Status" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <Badge variant={dealStatusBadgeVariant(row.original.status)}>{DEAL_STATUS_LABELS[row.original.status]}</Badge>,
    },
    {
      id: "amount",
      accessorFn: (row) => row.amount ?? 0,
      meta: { title: "Kwota" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kwota" />,
      cell: ({ row }) => row.original.amount === null ? "—" : formatCurrencyPln(row.original.amount),
    },
    {
      id: "source",
      accessorFn: (row) => (row.source ? DEAL_SOURCE_LABELS[row.source] : "—"),
      enableGrouping: true,
      meta: { title: "Źródło" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Źródło" />,
      cell: ({ row }) => (row.original.source ? DEAL_SOURCE_LABELS[row.original.source] : "—"),
    },
    {
      id: "dealType",
      accessorFn: (row) => (row.dealType ? DEAL_TYPE_LABELS[row.dealType] : "—"),
      enableGrouping: true,
      meta: { title: "Typ" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Typ" />,
      cell: ({ row }) => (row.original.dealType ? DEAL_TYPE_LABELS[row.original.dealType] : "—"),
    },
    {
      accessorKey: "ownerName",
      enableGrouping: true,
      meta: { title: "Opiekun" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Opiekun" />,
    },
    {
      accessorKey: "createdAt",
      meta: { title: "Utworzono" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Utworzono" />,
      cell: ({ row }) => formatDatePl(row.original.createdAt),
    },
  ]
}

export function buildDealTableRow(
  deal: Deal,
  users: readonly DemoUser[],
  contacts: readonly CrmContact[],
  clients: readonly Client[] = [],
): DealTableRow {
  const ownerName = users.find((u) => u.id === deal.ownerId)?.displayName ?? "—"
  const contact = deal.contactId ? contacts.find((c) => c.id === deal.contactId) : undefined
  const contactLabel = contact ? formatContactName(contact) : null
  const clientName = deal.clientId
    ? (clients.find((c) => c.id === deal.clientId)?.name ?? "")
    : ""
  return {
    ...deal,
    ownerName,
    contactLabel,
    _filter: `${deal.name} ${ownerName} ${contactLabel ?? ""} ${clientName}`.toLowerCase(),
  }
}

