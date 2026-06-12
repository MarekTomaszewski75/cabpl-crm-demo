"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DealCloseDateUrgencyIcon } from "@/components/crm/deal-close-date-urgency-icon"
import { DealStatusBadge } from "@/components/crm/deal-status-badge"
import { DEAL_EXPECTED_CLOSE_DATE_LABEL } from "@/lib/crm/deal-close-date-urgency"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import {
  DEAL_SOURCE_LABELS,
  DEAL_TYPE_LABELS,
} from "@/lib/crm/deal-labels"
import { formatContactName } from "@/lib/crm/contact-display"
import {
  DEAL_PIPELINE_CATEGORY_LABELS,
  getDealStatusLabel,
} from "@/lib/crm/deal-pipeline-labels"
import {
  isPipelineCategoryId,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import { formatCurrencyPln, formatDatePl } from "@/lib/format/pl"
import type { Client, CrmContact, Deal, DemoUser, Product } from "@/types/crm"

export type DealTableRow = Deal & {
  ownerName: string
  clientName: string
  contactLabel: string | null
  categoryName: string
  productName: string
  _filter: string
}

type DealsColumnsContext = {
  showOwnerColumn: boolean
}

function resolvePipelineCategoryId(
  pipelineCategoryId: string,
): PipelineCategoryId | undefined {
  return isPipelineCategoryId(pipelineCategoryId)
    ? pipelineCategoryId
    : undefined
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
      accessorKey: "categoryName",
      enableGrouping: true,
      meta: { title: "Kategoria" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kategoria" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">{row.original.categoryName}</span>
      ),
      sortingFn: (a, b) =>
        a.original.categoryName.localeCompare(b.original.categoryName, "pl"),
    },
    {
      accessorKey: "productName",
      enableGrouping: true,
      meta: { title: "Produkt" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produkt" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate">{row.original.productName}</span>
      ),
      sortingFn: (a, b) =>
        a.original.productName.localeCompare(b.original.productName, "pl"),
    },
    {
      id: "status",
      accessorFn: (row) =>
        getDealStatusLabel(
          row.status,
          resolvePipelineCategoryId(row.pipelineCategoryId),
        ),
      enableGrouping: true,
      meta: { title: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <DealStatusBadge
          status={row.original.status}
          pipelineCategoryId={row.original.pipelineCategoryId}
        />
      ),
      sortingFn: (a, b) =>
        getDealStatusLabel(
          a.original.status,
          resolvePipelineCategoryId(a.original.pipelineCategoryId),
        ).localeCompare(
          getDealStatusLabel(
            b.original.status,
            resolvePipelineCategoryId(b.original.pipelineCategoryId),
          ),
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
      id: "expectedCloseDate",
      accessorKey: "expectedCloseDate",
      meta: { title: DEAL_EXPECTED_CLOSE_DATE_LABEL },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={DEAL_EXPECTED_CLOSE_DATE_LABEL}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="tabular-nums">
            {row.original.expectedCloseDate
              ? formatDatePl(row.original.expectedCloseDate)
              : "—"}
          </span>
          <DealCloseDateUrgencyIcon deal={row.original} />
        </div>
      ),
      sortingFn: (a, b) => {
        const left = a.original.expectedCloseDate ?? ""
        const right = b.original.expectedCloseDate ?? ""
        if (!left && !right) return 0
        if (!left) return 1
        if (!right) return -1
        return left.localeCompare(right)
      },
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
  products: readonly Product[] = [],
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
  const productName =
    products.find((product) => product.id === deal.productId)?.name ?? "—"
  const categoryName = isPipelineCategoryId(deal.pipelineCategoryId)
    ? DEAL_PIPELINE_CATEGORY_LABELS[deal.pipelineCategoryId]
    : "—"
  return {
    ...deal,
    ownerName,
    clientName,
    contactLabel,
    categoryName,
    productName,
    _filter: `${deal.name} ${ownerName} ${contactLabel ?? ""} ${clientName} ${categoryName} ${productName}`.toLowerCase(),
  }
}
