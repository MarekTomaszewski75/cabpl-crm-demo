"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LandmarkIcon, SearchIcon } from "lucide-react"
import {
  buildCompanyBankingProductTableRow,
  createCompanyBankingProductsColumns,
} from "@/components/crm/company-banking-products-columns"
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
import type { EnrichedClientBankingProduct } from "@/lib/crm/client-banking-products"

type CompanyBankingProductsTableProps = {
  clientId: string
  products: EnrichedClientBankingProduct[]
}

export function CompanyBankingProductsTable({
  clientId,
  products,
}: CompanyBankingProductsTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  const tableRows = React.useMemo(
    () => products.map(buildCompanyBankingProductTableRow),
    [products],
  )

  const filteredRows = React.useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return tableRows
    return tableRows.filter((row) => row._filter.includes(normalized))
  }, [tableRows, searchQuery])

  const columns = React.useMemo(
    () => createCompanyBankingProductsColumns(),
    [],
  )

  return (
    <Card size="sm">
      <CardHeader className="flex flex-col gap-4 pb-2">
        <CardTitle className="text-base">Produkty bankowe</CardTitle>
        <InputGroup className="max-w-md">
          <InputGroupInput
            placeholder="Szukaj produktów, rachunków, umów"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Szukaj produktów bankowych"
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
        {products.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LandmarkIcon />
              </EmptyMedia>
              <EmptyTitle>Brak produktów bankowych</EmptyTitle>
              <EmptyDescription>
                Firma nie posiada jeszcze aktywnych produktów w relacji z
                bankiem.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            showSearchInToolbar={false}
            onRowClick={(row) =>
              router.push(
                `/clients/${clientId}/banking-products/${row.id}`,
              )
            }
          />
        )}
      </CardContent>
    </Card>
  )
}
