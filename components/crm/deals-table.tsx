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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import {
  canFinishDeal,
  DEAL_SOURCE_LABELS,
  DEAL_STATUS_LABELS,
  DEAL_STATUS_OPTIONS,
  DEAL_TYPE_LABELS,
} from "@/lib/crm/deal-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  CrmContact,
  Deal,
  DealSource,
  DealStatus,
  DealType,
  DemoUser,
} from "@/types/crm"

type DealsViewMode = "table" | "kanban"

const FILTER_ALL = "all"
const DEAL_TYPE_NONE = "__none__"
const DEAL_SOURCE_NONE = "__source_none__"

const DEAL_GROUPING_OPTIONS = [
  { columnId: "status", label: "Status" },
  { columnId: "source", label: "Źródło" },
  { columnId: "dealType", label: "Typ" },
  { columnId: "ownerName", label: "Opiekun" },
] as const

type StatusTabValue = typeof FILTER_ALL | DealStatus

function filterByStatusTab(
  deals: readonly Deal[],
  statusTab: StatusTabValue,
): Deal[] {
  if (statusTab === FILTER_ALL) return [...deals]
  return deals.filter((deal) => deal.status === statusTab)
}

function applyDealListFilters(
  deals: Deal[],
  filters: {
    sourceFilters: string[]
    ownerFilters: string[]
    dealTypeFilters: string[]
    searchQuery: string
    users: readonly DemoUser[]
    contacts: readonly CrmContact[]
    clients: readonly Client[]
  },
): Deal[] {
  const searchNormalized = filters.searchQuery.trim().toLowerCase()

  return deals.filter((deal) => {
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
    if (!searchNormalized) return true
    const row = buildDealTableRow(
      deal,
      filters.users,
      filters.contacts,
      filters.clients,
    )
    return row._filter.includes(searchNormalized)
  })
}

export function DealsTable() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { deals, users, contacts, clients } = useDemoData()
  const [statusTab, setStatusTab] = React.useState<StatusTabValue>(FILTER_ALL)
  const [sourceFilters, setSourceFilters] = React.useState<string[]>([])
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [dealTypeFilters, setDealTypeFilters] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<DealsViewMode>("table")
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)

  const columns = React.useMemo(() => createDealsColumns(), [])

  const scopedDeals = React.useMemo(() => {
    if (!user) return []
    return filterByScope(deals, user)
  }, [deals, user])

  const statusCounts = React.useMemo(() => {
    const counts = Object.fromEntries(
      DEAL_STATUS_OPTIONS.map((status) => [status, 0]),
    ) as Record<DealStatus, number>
    for (const deal of scopedDeals) {
      counts[deal.status] += 1
    }
    return {
      all: scopedDeals.length,
      ...counts,
    }
  }, [scopedDeals])

  const statusScopedDeals = React.useMemo(
    () =>
      viewMode === "table"
        ? filterByStatusTab(scopedDeals, statusTab)
        : [...scopedDeals],
    [scopedDeals, statusTab, viewMode],
  )

  const filterInput = React.useMemo(
    () => ({
      sourceFilters,
      ownerFilters,
      dealTypeFilters,
      searchQuery,
      users,
      contacts,
      clients,
    }),
    [
      sourceFilters,
      ownerFilters,
      dealTypeFilters,
      searchQuery,
      users,
      contacts,
      clients,
    ],
  )

  const filteredDeals = React.useMemo(
    () => applyDealListFilters(statusScopedDeals, filterInput),
    [statusScopedDeals, filterInput],
  )

  const ownerNameById = React.useMemo(
    () => new Map(users.map((u) => [u.id, u.displayName])),
    [users],
  )

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of statusScopedDeals) {
      counts.set(deal.ownerId, (counts.get(deal.ownerId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([ownerId, count]) => ({
        label: ownerNameById.get(ownerId) ?? ownerId,
        value: ownerId,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [statusScopedDeals, ownerNameById])

  const sourceFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of statusScopedDeals) {
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
  }, [statusScopedDeals])

  const dealTypeFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const deal of statusScopedDeals) {
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
  }, [statusScopedDeals])

  const tableData = React.useMemo(
    (): DealTableRow[] =>
      filteredDeals.map((deal) =>
        buildDealTableRow(deal, users, contacts, clients),
      ),
    [filteredDeals, users, contacts, clients],
  )

  const openCount = scopedDeals.filter((deal) =>
    canFinishDeal(deal.status),
  ).length

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
        <CardHeader className="flex flex-col gap-2 pb-0">
          <div className="flex w-full min-w-0 items-center gap-2">
            <CardTitle className="shrink-0 text-xl">Deale</CardTitle>
            <div
              className="flex shrink-0 items-center rounded-md border border-border p-0.5"
              role="group"
              aria-label="Widok listy deali"
            >
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
              <Tabs
                value={statusTab}
                onValueChange={(value) =>
                  setStatusTab(value as StatusTabValue)
                }
              >
                <TabsList className="w-fit">
                  <TabsTrigger value={FILTER_ALL}>
                    Wszystkie
                    <span className="text-muted-foreground tabular-nums">
                      ({statusCounts.all})
                    </span>
                  </TabsTrigger>
                  {DEAL_STATUS_OPTIONS.map((status) => (
                    <TabsTrigger key={status} value={status}>
                      {DEAL_STATUS_LABELS[status]}
                      <span className="text-muted-foreground tabular-nums">
                        ({statusCounts[status]})
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            ) : null}
            <DataTableFacetedFilter
              title="Źródło"
              options={sourceFacetedOptions}
              selectedValues={sourceFilters}
              onSelectedValuesChange={setSourceFilters}
            />
            <DataTableFacetedFilter
              title="Opiekun"
              options={ownerFacetedOptions}
              selectedValues={ownerFilters}
              onSelectedValuesChange={setOwnerFilters}
            />
            <DataTableFacetedFilter
              title="Typ deala"
              options={dealTypeFacetedOptions}
              selectedValues={dealTypeFilters}
              onSelectedValuesChange={setDealTypeFilters}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {openCount} w toku przetwarzania · {scopedDeals.length}{" "}
            {scopedDeals.length === 1 ? "deal" : "deali"} w Twoim zakresie
          </p>
        </CardHeader>
      </Card>

      <Card size="sm" className="gap-3">
        <CardContent className="pt-3">
          {scopedDeals.length === 0 ? (
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
          ) : viewMode === "table" ? (
            <DataTable
              columns={columns}
              data={tableData}
              emptyMessage="Brak wyników dla podanych filtrów."
              initialSorting={[{ id: "createdAt", desc: true }]}
              showSearchInToolbar={false}
              showToolbar={scopedDeals.length > 0}
              groupingOptions={[...DEAL_GROUPING_OPTIONS]}
              onRowClick={(row) => router.push(`/pipeline/${row.id}`)}
            />
          ) : filteredDeals.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Brak wyników</EmptyTitle>
                <EmptyDescription>
                  Zmień filtry lub wyszukiwanie, aby zobaczyć deale na
                  tablicy.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DealsKanbanBoard
              deals={filteredDeals}
              onAddDeal={() => setCreateSheetOpen(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
