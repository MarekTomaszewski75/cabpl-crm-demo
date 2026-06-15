"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatContactName } from "@/lib/crm/contact-display"
import { createFilterSearchColumn } from "@/lib/crm/data-table-filter-column"
import type { ContactCompanyBinding, CrmContact } from "@/types/crm"

export type ContactTableRow = {
  contact: CrmContact
  bindings: ContactCompanyBinding[]
  clientNameById: Map<string, string>
  _filter: string
}

const MAX_VISIBLE_RELATIONS = 2

type RelationLine = {
  clientId: string
  companyName: string
  role: string
}

function formatMultiValueTooltip(values: string[]): string | null {
  if (values.length <= 1) return null
  return values.slice(1).join("\n")
}

function formatRelationsCell(
  bindings: ContactCompanyBinding[],
  clientNameById: Map<string, string>,
): { visible: RelationLine[]; hiddenCount: number } {
  const lines = bindings.map((binding) => ({
    clientId: binding.clientId,
    companyName: clientNameById.get(binding.clientId) ?? binding.clientId,
    role: binding.roleAtCompany.trim() || "—",
  }))

  if (lines.length <= MAX_VISIBLE_RELATIONS) {
    return { visible: lines, hiddenCount: 0 }
  }

  return {
    visible: lines.slice(0, MAX_VISIBLE_RELATIONS),
    hiddenCount: lines.length - MAX_VISIBLE_RELATIONS,
  }
}

function CompanyClientLink({
  clientId,
  companyName,
}: {
  clientId: string
  companyName: string
}) {
  return (
    <Link
      href={`/clients/${clientId}`}
      onClick={(event) => event.stopPropagation()}
      className="inline-flex rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Badge
        variant="secondary"
        className="cursor-pointer hover:bg-secondary/80"
      >
        {companyName}
      </Badge>
    </Link>
  )
}

function RelationCompanyLine({ line }: { line: RelationLine }) {
  return (
    <div className="flex min-w-0 items-center gap-1 truncate">
      <Link
        href={`/clients/${line.clientId}`}
        onClick={(event) => event.stopPropagation()}
        className="truncate font-medium hover:underline"
      >
        {line.companyName}
      </Link>
      <span className="shrink-0 text-muted-foreground">·</span>
      <span className="truncate">{line.role}</span>
    </div>
  )
}

export function buildContactTableRow(
  contact: CrmContact,
  bindings: ContactCompanyBinding[],
  clientNameById: Map<string, string>,
): ContactTableRow {
  const companyNames = bindings
    .map((binding) => clientNameById.get(binding.clientId) ?? "")
    .filter(Boolean)

  const relationText = bindings
    .map((binding) => {
      const companyName = clientNameById.get(binding.clientId) ?? ""
      const role = binding.roleAtCompany.trim() || "—"
      return `${companyName} ${role}`
    })
    .join(" ")

  const _filter = [
    formatContactName(contact),
    ...contact.emails,
    ...contact.phones,
    ...companyNames,
    relationText,
  ]
    .join(" ")
    .toLowerCase()

  return {
    contact,
    bindings,
    clientNameById,
    _filter,
  }
}

export function createContactsColumns(): ColumnDef<ContactTableRow>[] {
  return [
    createFilterSearchColumn<ContactTableRow>(),
    {
      id: "fullName",
      accessorFn: (row) => formatContactName(row.contact),
      meta: { title: "Imię i nazwisko" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Imię i nazwisko" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{formatContactName(row.original.contact)}</span>
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
      id: "companies",
      accessorFn: (row) =>
        row.bindings
          .map((binding) => row.clientNameById.get(binding.clientId) ?? "")
          .join(" "),
      meta: { title: "Firmy" },
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Firmy" />
      ),
      cell: ({ row }) => {
        if (row.original.bindings.length === 0) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <div className="flex max-w-md flex-wrap gap-1">
            {row.original.bindings.map((binding) => {
              const companyName =
                row.original.clientNameById.get(binding.clientId) ??
                binding.clientId

              return (
                <CompanyClientLink
                  key={binding.clientId}
                  clientId={binding.clientId}
                  companyName={companyName}
                />
              )
            })}
          </div>
        )
      },
    },
    {
      id: "relation",
      accessorFn: (row) =>
        row.bindings.map((binding) => binding.roleAtCompany).join(" "),
      meta: { title: "Relacja" },
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Relacja" />
      ),
      cell: ({ row }) => {
        const { bindings, clientNameById } = row.original

        if (bindings.length === 0) {
          return <span className="text-muted-foreground">—</span>
        }

        if (bindings.length === 1) {
          const role = bindings[0].roleAtCompany.trim()
          return (
            <span className="max-w-56 truncate">
              {role || "—"}
            </span>
          )
        }

        const { visible, hiddenCount } = formatRelationsCell(
          bindings,
          clientNameById,
        )

        return (
          <div className="flex max-w-md flex-col gap-0.5 text-sm">
            {visible.map((line) => (
              <RelationCompanyLine key={line.clientId} line={line} />
            ))}
            {hiddenCount > 0 ? (
              <span className="text-muted-foreground">+{hiddenCount}</span>
            ) : null}
          </div>
        )
      },
    },
  ]
}
