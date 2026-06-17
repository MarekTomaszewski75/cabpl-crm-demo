"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BriefcaseIcon, SearchIcon } from "lucide-react"
import {
  buildDealTableRow,
  createDealsColumns,
  type DealTableRow,
} from "@/components/crm/deals-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableDateRangeFilter } from "@/components/data-table/data-table-date-range-filter"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
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
import { useSession } from "@/lib/auth/demo-session"
import {
  DEAL_SOURCE_LABELS,
  DEAL_TYPE_LABELS,
} from "@/lib/crm/deal-labels"
import {
  DEAL_PIPELINE_CATEGORY_LABELS,
  getAllDealStatusFilterOptions,
} from "@/lib/crm/deal-pipeline-labels"
import { DEAL_EXPECTED_CLOSE_DATE_LABEL } from "@/lib/crm/deal-close-date-urgency"
import {
  matchesDealCloseDateRange,
  type DealCloseDateRangeFilter,
} from "@/lib/crm/deal-close-date-filter"
import { getPipelineCategoryIds } from "@/lib/crm/deal-pipeline"
import { useDemoData } from "@/lib/data/demo-data-context"
import type {
  Client,
  CrmContact,
  Deal,
  DealSource,
  DealType,
  DemoUser,
  Product,
  BankAccount,
} from "@/types/crm"

type CompanyDealsTableProps = {
  deals: Deal[]
}

const DEAL_TYPE_NONE = "__none__"
const DEAL_SOURCE_NONE = "__source_none__"

function createDealGroupingOptions(showOwnerColumn: boolean) {
  const options = [
    { columnId: "categoryName", label: "Kategoria" },
    { columnId: "productName", label: "Produkt" },
    { columnId: "status", label: "Status" },
    { columnId: "source", label: "Źródło" },
    { columnId: "dealType", label: "Typ" },
  ]
  if (showOwnerColumn) {
    options.push({ columnId: "ownerName", label: "Opiekun" })
  }
  return options
}

function applyDealListFilters(
  deals: Deal[],
  filters: {
    categoryFilters: string[]
    statusFilters: string[]
    sourceFilters: string[]
    ownerFilters: string[]
    dealTypeFilters: string[]
    closeDateRange: DealCloseDateRangeFilter
    searchQuery: string
    users: readonly DemoUser[]
    contacts: readonly CrmContact[]
    clients: readonly Client[]
    products: readonly Product[]
    bankAccounts: readonly BankAccount[]
  },
): Deal[] {
  const searchNormalized = filters.searchQuery.trim().toLowerCase()

  return deals.filter((deal) => {
    if (
      filters.categoryFilters.length > 0 &&
      !filters.categoryFilters.includes(deal.pipelineCategoryId)
    ) {
      return false
    }
    if (
      filters.statusFilters.length > 0 &&
      !filters.statusFilters.includes(deal.status)
    ) {
      return false
    }
    if (filters.sourceFilters.length > 0) {
      const sourceKey = deal.source ?? DEAL_SOURCE_NONE
      if (!filters.sourceFilters.includes(sourceKey)) return false
    }
    if (
      filters.ownerFilters.length > 0 &&
      !filters.ownerFilters.includes(deal.ownerId)
    ) {
      return false
    }
    if (filters.dealTypeFilters.length > 0) {
      const typeKey = deal.dealType ?? DEAL_TYPE_NONE
      if (!filters.dealTypeFilters.includes(typeKey)) return false
    }
    if (
      !matchesDealCloseDateRange(deal.expectedCloseDate, filters.closeDateRange)
    ) {
      return false
    }
    if (!searchNormalized) return true
    const row = buildDealTableRow(
      deal,
      filters.users,
      filters.contacts,
      filters.clients,
      filters.products,
      filters.bankAccounts,
    )
    return row._filter.includes(searchNormalized)
  })
}

export function CompanyDealsTable({ deals }: CompanyDealsTableProps) {
  const router = useRouter()
  const { user } = useSession()
  const { users, contacts, clients, products, bankAccounts } = useDemoData()
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([])
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  const [sourceFilters, setSourceFilters] = React.useState<string[]>([])
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [dealTypeFilters, setDealTypeFilters] = React.useState<string[]>([])
  const [closeDateRange, setCloseDateRange] =
    React.useState<DealCloseDateRangeFilter>({})
  const [searchQuery, setSearchQuery] = React.useState("")

  const showOwnerColumn = user?.role !== "advisor"

  const columns = React.useMemo(
    () =>
      createDealsColumns({
        showOwnerColumn,
        showCompanyColumn: false,
      }),
    [showOwnerColumn],
  )

  const dealGroupingOptions = React.useMemo(
    () => createDealGroupingOptions(showOwnerColumn),
    [showOwnerColumn],
  )

  const filterInput = React.useMemo(
    () => ({
      categoryFilters,
      statusFilters,
      sourceFilters,
      ownerFilters: showOwnerColumn ? ownerFilters : [],
      dealTypeFilters,
      closeDateRange,
      searchQuery,
      users,
      contacts,
      clients,
      products,
      bankAccounts,
    }),
    [
      categoryFilters,
      statusFilters,
      sourceFilters,
      ownerFilters,
      dealTypeFilters,
      closeDateRange,
      searchQuery,
      users,
      contacts,
      clients,
      products,
      bankAccounts,
      showOwnerColumn,
    ],
  )

  const filteredDeals = React.useMemo(
    () => applyDealListFilters(deals, filterInput),
    [deals, filterInput],
  )

  const categoryFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of deals) {
      counts.set(
        deal.pipelineCategoryId,
        (counts.get(deal.pipelineCategoryId) ?? 0) + 1,
      )
    }
    return getPipelineCategoryIds()
      .map((categoryId) => ({
        label: DEAL_PIPELINE_CATEGORY_LABELS[categoryId],
        value: categoryId,
        count: counts.get(categoryId) ?? 0,
      }))
      .filter((option) => option.count > 0)
  }, [deals])

  const statusFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of deals) {
      counts.set(deal.status, (counts.get(deal.status) ?? 0) + 1)
    }
    const labelByStatus = new Map<string, string>()
    for (const option of getAllDealStatusFilterOptions()) {
      if (!labelByStatus.has(option.value)) {
        labelByStatus.set(option.value, option.label)
      }
    }
    return [...counts.entries()]
      .map(([status, count]) => ({
        label: labelByStatus.get(status) ?? status,
        value: status,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [deals])

  const ownerNameById = React.useMemo(
    () => new Map(users.map((u) => [u.id, u.displayName])),
    [users],
  )

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of deals) {
      counts.set(deal.ownerId, (counts.get(deal.ownerId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([ownerId, count]) => ({
        label: ownerNameById.get(ownerId) ?? ownerId,
        value: ownerId,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [deals, ownerNameById])

  const sourceFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of deals) {
      const key = deal.source ?? DEAL_SOURCE_NONE
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    const options: { label: string; value: string; count: number }[] = []
    if ((counts.get(DEAL_SOURCE_NONE) ?? 0) > 0) {
      options.push({
        label: "Brak",
        value: DEAL_SOURCE_NONE,
        count: counts.get(DEAL_SOURCE_NONE) ?? 0,
      })
    }
    for (const source of Object.keys(DEAL_SOURCE_LABELS) as DealSource[]) {
      const count = counts.get(source) ?? 0
      if (count > 0) {
        options.push({
          label: DEAL_SOURCE_LABELS[source],
          value: source,
          count,
        })
      }
    }
    return options.sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [deals])

  const dealTypeFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of deals) {
      const key = deal.dealType ?? DEAL_TYPE_NONE
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    const options: { label: string; value: string; count: number }[] = []
    if ((counts.get(DEAL_TYPE_NONE) ?? 0) > 0) {
      options.push({
        label: "Brak",
        value: DEAL_TYPE_NONE,
        count: counts.get(DEAL_TYPE_NONE) ?? 0,
      })
    }
    for (const type of Object.keys(DEAL_TYPE_LABELS) as DealType[]) {
      const count = counts.get(type) ?? 0
      if (count > 0) {
        options.push({
          label: DEAL_TYPE_LABELS[type],
          value: type,
          count,
        })
      }
    }
    return options.sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [deals])

  const tableData = React.useMemo(
    (): DealTableRow[] =>
      filteredDeals.map((deal) =>
        buildDealTableRow(deal, users, contacts, clients, products, bankAccounts),
      ),
    [filteredDeals, users, contacts, clients, products, bankAccounts],
  )

  const resultCountLabel = React.useMemo(() => {
    const n = filteredDeals.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [filteredDeals.length])

  return (
    <Card size="sm" id="company-deals-section">
      <CardHeader className="flex flex-col gap-3 pb-2">
        <CardTitle className="text-base">Deale</CardTitle>
        <InputGroup className="max-w-md">
          <InputGroupInput
            type="search"
            placeholder="Szukaj deali"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Szukaj deali"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="tabular-nums">
            {resultCountLabel}
          </InputGroupAddon>
        </InputGroup>
        {deals.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <DataTableFacetedFilter
              title="Kategoria"
              options={categoryFacetedOptions}
              selectedValues={categoryFilters}
              onSelectedValuesChange={setCategoryFilters}
            />
            <DataTableFacetedFilter
              title="Status"
              options={statusFacetedOptions}
              selectedValues={statusFilters}
              onSelectedValuesChange={setStatusFilters}
            />
            <DataTableFacetedFilter
              title="Źródło"
              options={sourceFacetedOptions}
              selectedValues={sourceFilters}
              onSelectedValuesChange={setSourceFilters}
            />
            {showOwnerColumn ? (
              <DataTableFacetedFilter
                title="Opiekun"
                options={ownerFacetedOptions}
                selectedValues={ownerFilters}
                onSelectedValuesChange={setOwnerFilters}
              />
            ) : null}
            <DataTableFacetedFilter
              title="Typ deala"
              options={dealTypeFacetedOptions}
              selectedValues={dealTypeFilters}
              onSelectedValuesChange={setDealTypeFilters}
            />
            <DataTableDateRangeFilter
              title={DEAL_EXPECTED_CLOSE_DATE_LABEL}
              value={closeDateRange}
              onValueChange={setCloseDateRange}
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BriefcaseIcon />
              </EmptyMedia>
              <EmptyTitle>Brak deali</EmptyTitle>
              <EmptyDescription>
                Brak deali powiązanych z tą firmą.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            emptyMessage="Brak wyników dla podanych filtrów."
            initialSorting={[{ id: "createdAt", desc: true }]}
            showSearchInToolbar={false}
            showToolbar={deals.length > 0}
            groupingOptions={dealGroupingOptions}
            onRowClick={(row) => router.push(`/pipeline/${row.id}`)}
          />
        )}
      </CardContent>
    </Card>
  )
}
