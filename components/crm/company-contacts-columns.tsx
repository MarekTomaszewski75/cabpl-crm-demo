"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatContactName } from "@/lib/crm/contact-display"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import type {
  ContactCompanyBinding,
  ContactCompanyBindingSource,
  CrmContact,
} from "@/types/crm"

export type CompanyContactTableRow = {
  contact: CrmContact
  binding: ContactCompanyBinding
  _filter: string
}

const SOURCE_LABELS: Record<ContactCompanyBindingSource, string> = {
  company: "Firma",
  deal: "Deal",
  lead: "Lead",
}

function formatMultiValueTooltip(values: string[]): string | null {
  if (values.length <= 1) return null
  return values.slice(1).join("\n")
}

export function buildCompanyContactTableRow(
  contact: CrmContact,
  binding: ContactCompanyBinding,
): CompanyContactTableRow {
  const role = binding.roleAtCompany.trim() || "—"

  const _filter = [
    formatContactName(contact),
    ...contact.emails,
    ...contact.phones,
    role,
    SOURCE_LABELS[binding.source],
  ]
    .join(" ")
    .toLowerCase()

  return {
    contact,
    binding,
    _filter,
  }
}

export function createCompanyContactsColumns(): ColumnDef<CompanyContactTableRow>[] {
  return [
    createFilterSearchColumn<CompanyContactTableRow>(),
    {
      id: "fullName",
      accessorFn: (row) => formatContactName(row.contact),
      meta: { title: "Imię i nazwisko" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Imię i nazwisko" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatContactName(row.original.contact)}
        </span>
      ),
    },
    {
      id: "email",
      accessorFn: (row) => row.contact.emails[0] ?? "",
      meta: { title: "E-mail" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-mail" />
      ),
      cell: ({ row }) => {
        const primary = row.original.contact.emails[0]
        const tooltip = formatMultiValueTooltip(row.original.contact.emails)

        if (!primary) {
          return <span className="text-muted-foreground">—</span>
        }

        if (!tooltip) {
          return <span className="max-w-48 truncate">{primary}</span>
        }

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-48 truncate">{primary}</span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      id: "phone",
      accessorFn: (row) => row.contact.phones[0] ?? "",
      meta: { title: "Telefon" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Telefon" />
      ),
      cell: ({ row }) => {
        const primary = row.original.contact.phones[0]
        const tooltip = formatMultiValueTooltip(row.original.contact.phones)

        if (!primary) {
          return <span className="text-muted-foreground">—</span>
        }

        if (!tooltip) {
          return (
            <span className="max-w-40 truncate tabular-nums">{primary}</span>
          )
        }

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-40 truncate tabular-nums">{primary}</span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      id: "relation",
      accessorFn: (row) => row.binding.roleAtCompany,
      meta: { title: "Relacja" },
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Relacja" />
      ),
      cell: ({ row }) => {
        const { binding } = row.original
        const role = binding.roleAtCompany.trim() || "—"

        return (
          <div className="flex max-w-md flex-wrap items-center gap-1.5">
            <span className="truncate">{role}</span>
            <Badge variant="outline">{SOURCE_LABELS[binding.source]}</Badge>
          </div>
        )
      },
    },
  ]
}
