"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CLIENT_BANKING_PRODUCT_STATUS_LABELS,
  clientBankingProductStatusBadgeVariant,
} from "@/lib/crm/client-banking-product-labels"
import { formatClientBankingProductAmountSummary } from "@/lib/crm/client-banking-product-display"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import { PRODUCT_TYPE_LABELS } from "@/lib/crm/product-labels"
import {
  formatDatePl,
  formatIban,
} from "@/lib/format/pl"
import type { EnrichedClientBankingProduct } from "@/lib/crm/client-banking-products"

export type CompanyBankingProductTableRow = EnrichedClientBankingProduct & {
  _filter: string
}

export function buildCompanyBankingProductTableRow(
  item: EnrichedClientBankingProduct,
): CompanyBankingProductTableRow {
  const _filter = [
    item.product.name,
    item.categoryName,
    PRODUCT_TYPE_LABELS[item.product.productType],
    item.bankAccountNumber,
    item.bankAccountName,
    item.contractNumber,
    CLIENT_BANKING_PRODUCT_STATUS_LABELS[item.status],
    item.currency,
  ]
    .join(" ")
    .toLowerCase()

  return { ...item, _filter }
}

export function createCompanyBankingProductsColumns(): ColumnDef<CompanyBankingProductTableRow>[] {
  return [
    createFilterSearchColumn<CompanyBankingProductTableRow>(),
    {
      id: "productName",
      accessorFn: (row) => row.product.name,
      meta: { title: "Produkt" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produkt" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.original.product.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.categoryName}
          </span>
        </div>
      ),
    },
    {
      id: "productType",
      accessorFn: (row) => row.product.productType,
      meta: { title: "Typ" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {PRODUCT_TYPE_LABELS[row.original.product.productType]}
        </Badge>
      ),
    },
    {
      id: "bankAccount",
      accessorFn: (row) => row.bankAccountNumber,
      meta: { title: "Rachunek bankowy" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rachunek bankowy" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 font-mono text-xs">
          <span>{formatIban(row.original.bankAccountNumber)}</span>
          <span className="font-sans text-muted-foreground">
            {row.original.bankAccountName}
          </span>
        </div>
      ),
    },
    {
      id: "contractNumber",
      accessorFn: (row) => row.contractNumber,
      meta: { title: "Nr umowy" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nr umowy" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row.original.contractNumber}
        </span>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => row.status,
      meta: { title: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={clientBankingProductStatusBadgeVariant(row.original.status)}
        >
          {CLIENT_BANKING_PRODUCT_STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
    {
      id: "amountSummary",
      accessorFn: (row) => formatClientBankingProductAmountSummary(row),
      meta: { title: "Kwota" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kwota" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatClientBankingProductAmountSummary(row.original)}
        </span>
      ),
    },
    {
      id: "currency",
      accessorFn: (row) => row.currency,
      meta: { title: "Waluta" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waluta" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.currency}</span>
      ),
    },
    {
      id: "openedAt",
      accessorFn: (row) => row.openedAt,
      meta: { title: "Data otwarcia" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data otwarcia" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatDatePl(row.original.openedAt)}
        </span>
      ),
    },
    {
      id: "expiresAt",
      accessorFn: (row) => row.expiresAt ?? "",
      meta: { title: "Data wygaśnięcia" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data wygaśnięcia" />
      ),
      cell: ({ row }) => {
        const expiresAt = row.original.expiresAt
        if (!expiresAt) {
          return <span className="text-muted-foreground">—</span>
        }

        const label = formatDatePl(expiresAt)
        if (row.original.status === "expiring") {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm tabular-nums text-amber-600 dark:text-amber-500">
                  {label}
                </span>
              </TooltipTrigger>
              <TooltipContent>Produkt wymaga odnowienia</TooltipContent>
            </Tooltip>
          )
        }

        return <span className="text-sm tabular-nums">{label}</span>
      },
    },
  ]
}
