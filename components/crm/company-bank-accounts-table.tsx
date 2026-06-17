"use client"

import * as React from "react"
import { LandmarkIcon, SearchIcon } from "lucide-react"
import {
  buildCompanyBankAccountTableRow,
  createCompanyBankAccountsColumns,
} from "@/components/crm/company-bank-accounts-columns"
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
import type { BankAccount } from "@/types/crm"

type CompanyBankAccountsTableProps = {
  accounts: BankAccount[]
}

export function CompanyBankAccountsTable({
  accounts,
}: CompanyBankAccountsTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const tableRows = React.useMemo(
    () => accounts.map(buildCompanyBankAccountTableRow),
    [accounts],
  )

  const filteredRows = React.useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return tableRows
    return tableRows.filter((row) => row._filter.includes(normalized))
  }, [tableRows, searchQuery])

  const columns = React.useMemo(() => createCompanyBankAccountsColumns(), [])

  return (
    <Card size="sm">
      <CardHeader className="flex flex-col gap-4 pb-2">
        <CardTitle className="text-base">Rachunki bankowe</CardTitle>
        <InputGroup className="max-w-md">
          <InputGroupInput
            placeholder="Szukaj rachunków, IBAN, typów"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Szukaj rachunków bankowych"
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
        {accounts.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LandmarkIcon />
              </EmptyMedia>
              <EmptyTitle>Brak rachunków bankowych</EmptyTitle>
              <EmptyDescription>
                Firma nie posiada jeszcze rachunków w relacji z bankiem.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            showSearchInToolbar={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
