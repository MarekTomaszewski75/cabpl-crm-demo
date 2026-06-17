"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { BANK_ACCOUNT_TYPE_LABELS } from "@/lib/crm/bank-account-labels"
import {
  CLIENT_BANKING_PRODUCT_STATUS_LABELS,
  clientBankingProductStatusBadgeVariant,
} from "@/lib/crm/client-banking-product-labels"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import { formatCurrency, formatDatePl, formatIban } from "@/lib/format/pl"
import type { BankAccount } from "@/types/crm"

export type CompanyBankAccountTableRow = BankAccount & {
  _filter: string
}

export function buildCompanyBankAccountTableRow(
  account: BankAccount,
): CompanyBankAccountTableRow {
  const _filter = [
    account.accountName,
    account.accountNumber,
    BANK_ACCOUNT_TYPE_LABELS[account.accountType],
    CLIENT_BANKING_PRODUCT_STATUS_LABELS[account.status],
    account.currency,
  ]
    .join(" ")
    .toLowerCase()

  return { ...account, _filter }
}

export function createCompanyBankAccountsColumns(): ColumnDef<CompanyBankAccountTableRow>[] {
  return [
    createFilterSearchColumn<CompanyBankAccountTableRow>(),
    {
      id: "accountName",
      accessorFn: (row) => row.accountName,
      meta: { title: "Nazwa rachunku" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nazwa rachunku" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.accountName}</span>
      ),
    },
    {
      id: "accountNumber",
      accessorFn: (row) => row.accountNumber,
      meta: { title: "Numer IBAN" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Numer IBAN" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {formatIban(row.original.accountNumber)}
        </span>
      ),
    },
    {
      id: "accountType",
      accessorFn: (row) => row.accountType,
      meta: { title: "Typ" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">
          {BANK_ACCOUNT_TYPE_LABELS[row.original.accountType]}
        </Badge>
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
      id: "balanceAmount",
      accessorFn: (row) => row.balanceAmount ?? "",
      meta: { title: "Saldo" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Saldo" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row.original.balanceAmount != null
            ? formatCurrency(
                row.original.balanceAmount,
                row.original.currency,
              )
            : "—"}
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
  ]
}
