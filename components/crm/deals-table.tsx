"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BriefcaseIcon,
  LayoutGridIcon,
  PlusIcon,
  Rows2Icon,
  SearchIcon,
} from "lucide-react"
import { DealFormDialog } from "@/components/crm/deal-form-dialog"
import { DealsKanbanBoard } from "@/components/crm/deals-kanban-board"
import {
  buildDealTableRow,
  createDealsColumns,
  type DealTableRow,
} from "@/components/crm/deals-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableDateRangeFilter } from "@/components/data-table/data-table-date-range-filter"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  DEFAULT_PIPELINE_CATEGORY_ID,
  getPipelineCategoryIds,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import { useDemoData } from "@/lib/data/demo-data-context"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  CrmContact,
  Deal,
  DealSource,
  DealType,
  DemoUser,
  Product,
} from "@/types/crm"

type DealsViewMode = "table" | "kanban"

const DEAL_TYPE_NONE = "__none__"
const DEAL_SOURCE_NONE = "__source_none__"

function createDealGroupingOptions(showOwnerColumn: boolean) {
  const options = [
    { columnId: "categoryName", label: "Kategoria" },
    { columnId: "productName", label: "Produkt" },
    { columnId: "status", label: "Status" },
    { columnId: "source", label: "Źródło" },
    { columnId: "dealType", label: "Typ" },
    { columnId: "clientName", label: "Firma" },
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
    )
    return row._filter.includes(searchNormalized)
  })
}

export function DealsTable() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { deals, users, contacts, clients, products } = useDemoData()
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([])
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  const [sourceFilters, setSourceFilters] = React.useState<string[]>([])
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [dealTypeFilters, setDealTypeFilters] = React.useState<string[]>([])
  const [closeDateRange, setCloseDateRange] =
    React.useState<DealCloseDateRangeFilter>({})
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<DealsViewMode>("kanban")
  const [selectedPipelineCategoryId, setSelectedPipelineCategoryId] =
    React.useState<PipelineCategoryId>(DEFAULT_PIPELINE_CATEGORY_ID)
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)

  const showOwnerColumn = user?.role !== "advisor"

  const columns = React.useMemo(
    () => createDealsColumns({ showOwnerColumn }),
    [showOwnerColumn],
  )

  const dealGroupingOptions = React.useMemo(
    () => createDealGroupingOptions(showOwnerColumn),
    [showOwnerColumn],
  )

  const scopedDeals = React.useMemo(() => {
    if (!user) return []
    return filterByScope(deals, user)
  }, [deals, user])

  const categoryScopedDeals = React.useMemo(
    () =>
      viewMode === "kanban"
        ? scopedDeals.filter(
            (deal) => deal.pipelineCategoryId === selectedPipelineCategoryId,
          )
        : [...scopedDeals],
    [scopedDeals, selectedPipelineCategoryId, viewMode],
  )

  const baseDeals = React.useMemo(
    () => (viewMode === "kanban" ? categoryScopedDeals : scopedDeals),
    [viewMode, categoryScopedDeals, scopedDeals],
  )

  const filterInput = React.useMemo(
    () => ({
      categoryFilters: viewMode === "table" ? categoryFilters : [],
      statusFilters: viewMode === "table" ? statusFilters : [],
      sourceFilters,
      ownerFilters: showOwnerColumn ? ownerFilters : [],
      dealTypeFilters,
      closeDateRange,
      searchQuery,
      users,
      contacts,
      clients,
      products,
    }),
    [
      viewMode,
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
      showOwnerColumn,
    ],
  )

  const filteredDeals = React.useMemo(
    () => applyDealListFilters(baseDeals, filterInput),
    [baseDeals, filterInput],
  )

  const categoryFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of scopedDeals) {
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
  }, [scopedDeals])

  const statusFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of scopedDeals) {
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
  }, [scopedDeals])

  const ownerNameById = React.useMemo(
    () => new Map(users.map((u) => [u.id, u.displayName])),
    [users],
  )

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of baseDeals) {
      counts.set(deal.ownerId, (counts.get(deal.ownerId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([ownerId, count]) => ({
        label: ownerNameById.get(ownerId) ?? ownerId,
        value: ownerId,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [baseDeals, ownerNameById])

  const sourceFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of baseDeals) {
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
  }, [baseDeals])

  const dealTypeFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of baseDeals) {
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
  }, [baseDeals])

  const tableData = React.useMemo(
    (): DealTableRow[] =>
      filteredDeals.map((deal) =>
        buildDealTableRow(deal, users, contacts, clients, products),
      ),
    [filteredDeals, users, contacts, clients, products],
  )

  const resultCountLabel = React.useMemo(() => {
    const n = filteredDeals.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [filteredDeals.length])

  if (!isReady || !user) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm" className="gap-3">
        <CardHeader className="flex flex-col gap-2 pb-3">
          <div className="flex w-full min-w-0 items-center gap-2">
            <CardTitle className="shrink-0 text-xl">Deale</CardTitle>
            <div
              className="flex shrink-0 items-center rounded-md border border-border p-0.5"
              role="group"
              aria-label="Widok listy deali"
            >
              <Button
                type="button"
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Widok kanban"
                aria-pressed={viewMode === "kanban"}
                onClick={() => setViewMode("kanban")}
              >
                <LayoutGridIcon />
              </Button>
              <Button
                type="button"
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Widok tabeli"
                aria-pressed={viewMode === "table"}
                onClick={() => setViewMode("table")}
              >
                <Rows2Icon />
              </Button>
            </div>
            <InputGroup className="h-9 min-h-9 min-w-0 flex-1 basis-0">
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
            <div className="shrink-0">
              <DealFormDialog
                open={createSheetOpen}
                onOpenChange={setCreateSheetOpen}
                onSuccess={(deal) => router.push(`/pipeline/${deal.id}`)}
                trigger={
                  <Button size="lg" onClick={() => setCreateSheetOpen(true)}>
                    <PlusIcon />
                    Nowy deal
                  </Button>
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {viewMode === "table" ? (
              <>
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
              </>
            ) : null}
            {viewMode === "kanban" ? (
              <Select
                value={selectedPipelineCategoryId}
                onValueChange={(value) =>
                  setSelectedPipelineCategoryId(value as PipelineCategoryId)
                }
              >
                <SelectTrigger
                  className="h-8 min-w-56"
                  aria-label="Kategoria produktu"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {getPipelineCategoryIds().map((categoryId) => (
                      <SelectItem key={categoryId} value={categoryId}>
                        {DEAL_PIPELINE_CATEGORY_LABELS[categoryId]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : null}
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

        </CardHeader>
      </Card>

      {scopedDeals.length === 0 ? (
        <Card size="sm" className="gap-3">
          <CardContent className="pt-3">
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BriefcaseIcon />
                </EmptyMedia>
                <EmptyTitle>Brak deali</EmptyTitle>
                <EmptyDescription>
                  Dodaj pierwszy deal przyciskiem „Nowy deal”.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : viewMode === "kanban" ? (
        filteredDeals.length === 0 && categoryScopedDeals.length > 0 ? (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyTitle>Brak wyników</EmptyTitle>
              <EmptyDescription>
                Zmień filtry lub wyszukiwanie, aby zobaczyć deale na tablicy.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DealsKanbanBoard
            deals={filteredDeals}
            pipelineCategoryId={selectedPipelineCategoryId}
            onAddDeal={() => setCreateSheetOpen(true)}
          />
        )
      ) : (
        <Card size="sm" className="gap-3">
          <CardContent className="pt-3">
            <DataTable
              columns={columns}
              data={tableData}
              emptyMessage="Brak wyników dla podanych filtrów."
              initialSorting={[{ id: "createdAt", desc: true }]}
              showSearchInToolbar={false}
              showToolbar={scopedDeals.length > 0}
              groupingOptions={dealGroupingOptions}
              onRowClick={(row) => router.push(`/pipeline/${row.id}`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
