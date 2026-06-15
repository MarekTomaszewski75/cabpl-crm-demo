"use client"

import * as React from "react"
import { ContactIcon, SearchIcon } from "lucide-react"
import {
  buildCompanyContactTableRow,
  createCompanyContactsColumns,
  type CompanyContactTableRow,
} from "@/components/crm/company-contacts-columns"
import { ContactFormDialog } from "@/components/crm/contact-form-dialog"
import { DataTable } from "@/components/data-table/data-table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { filterContactsBySearch } from "@/lib/crm/contact-search"
import type { EnrichedContactRow } from "@/types/crm"

type CompanyContactsTableProps = {
  clientId: string
  rows: EnrichedContactRow[]
}

export function CompanyContactsTable({
  clientId,
  rows,
}: CompanyContactsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [editRow, setEditRow] = React.useState<CompanyContactTableRow | null>(
    null,
  )
  const [editOpen, setEditOpen] = React.useState(false)

  const tableRows = React.useMemo(
    () =>
      rows.map((row) => {
        const binding = row.bindings[0]
        return buildCompanyContactTableRow(row.contact, binding)
      }),
    [rows],
  )

  const filteredRows = React.useMemo(
    () => filterContactsBySearch(tableRows, searchQuery),
    [tableRows, searchQuery],
  )

  const columns = React.useMemo(() => createCompanyContactsColumns(), [])

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open)
    if (!open) {
      setEditRow(null)
    }
  }

  return (
    <>
      <Card size="sm">
        <CardHeader className="flex flex-col gap-4 pb-2">
          <CardTitle className="text-base">Kontakty</CardTitle>
          <InputGroup className="max-w-md">
            <InputGroupInput
              placeholder="Szukaj kontaktów"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Szukaj kontaktów"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="tabular-nums">
              {filteredRows.length}
            </InputGroupAddon>
          </InputGroup>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <Empty className="border py-6">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ContactIcon />
                </EmptyMedia>
                <EmptyTitle>Brak kontaktów</EmptyTitle>
                <EmptyDescription>
                  Brak kontaktów powiązanych z tą firmą przez firmę, deal lub
                  lead.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              columns={columns}
              data={filteredRows}
              showSearchInToolbar={false}
              onRowClick={(row) => {
                setEditRow(row)
                setEditOpen(true)
              }}
            />
          )}
        </CardContent>
      </Card>

      <ContactFormDialog
        defaultClientId={clientId}
        contact={editRow?.contact}
        initialRoleAtCompany={editRow?.binding.roleAtCompany}
        bindingSource={editRow?.binding.source}
        open={editOpen}
        onOpenChange={handleEditOpenChange}
      />
    </>
  )
}
