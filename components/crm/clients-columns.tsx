"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  COMPANY_SOURCE_LABELS,
  COMPANY_TYPE_LABELS,
} from "@/lib/crm/company-labels";
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column";
import { formatDatePl } from "@/lib/format/pl";
import type { Client } from "@/types/crm";

export type ClientTableRow = Client & {
  ownerName: string;
  _filter: string;
};

export function createClientsColumns(): ColumnDef<ClientTableRow>[] {
  return [
    createFilterSearchColumn<ClientTableRow>(),
    {
      accessorKey: "name",
      meta: { title: "Firma" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Firma" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/clients/${row.original.id}`}
          className="max-w-56 truncate font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      id: "companyType",
      accessorFn: (row) => COMPANY_TYPE_LABELS[row.companyType],
      meta: { title: "Typ" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Typ" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {COMPANY_TYPE_LABELS[row.original.companyType]}
        </Badge>
      ),
    },
    {
      id: "source",
      accessorFn: (row) =>
        row.source ? COMPANY_SOURCE_LABELS[row.source] : "—",
      meta: { title: "Źródło" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Źródło" />
      ),
      cell: ({ row }) =>
        row.original.source ? (
          <span className="text-sm">
            {COMPANY_SOURCE_LABELS[row.original.source]}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "ownerName",
      meta: { title: "Opiekun" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Opiekun" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "lastActivityAt",
      meta: { title: "Ostatnia aktywność" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ostatnia aktywność" />
      ),
      cell: ({ row }) => formatDatePl(row.original.lastActivityAt),
      sortingFn: (a, b) =>
        new Date(a.original.lastActivityAt).getTime() -
        new Date(b.original.lastActivityAt).getTime(),
    },
    {
      accessorKey: "nip",
      meta: { title: "NIP" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NIP" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.nip || "—"}
        </span>
      ),
    },
    {
      accessorKey: "segment",
      meta: { title: "Segment" },
      enableGrouping: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Segment" />
      ),
      cell: ({ row }) => (
        <span className="max-w-48 truncate text-sm text-muted-foreground">
          {row.original.segment || "—"}
        </span>
      ),
    },
  ];
}
