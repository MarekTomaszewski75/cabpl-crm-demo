"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  LayoutGridIcon,
  PlusIcon,
  Rows2Icon,
  SearchIcon,
  UserPlusIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadsKanbanBoard } from "@/components/crm/leads-kanban-board"
import {
  buildLeadTableRow,
  createLeadsColumns,
  type LeadTableRow,
} from "@/components/crm/leads-columns"
import { LeadFormDialog } from "@/components/crm/lead-form-dialog"
import { DataTable } from "@/components/data-table/data-table"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth/demo-session"
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_OPTIONS,
  LEAD_TYPE_LABELS,
} from "@/lib/crm/lead-labels"
import { useDemoData } from "@/lib/data/demo-data-context"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  CrmContact,
  DemoUser,
  Lead,
  LeadSource,
  LeadStatus,
  LeadType,
} from "@/types/crm"

type LeadsViewMode = "table" | "kanban"

const FILTER_ALL = "all"
const LEAD_TYPE_NONE = "__none__"

type StatusTabValue = typeof FILTER_ALL | LeadStatus

function createLeadGroupingOptions(showOwnerColumn: boolean) {
  const options = [
    { columnId: "status", label: "Status" },
    { columnId: "source", label: "Źródło" },
    { columnId: "leadType", label: "Typ" },
    { columnId: "companyName", label: "Firma" },
  ]
  if (showOwnerColumn) {
    options.push({ columnId: "ownerName", label: "Opiekun" })
  }
  return options
}

function filterByStatusTab(
  leads: readonly Lead[],
  statusTab: StatusTabValue,
): Lead[] {
  if (statusTab === FILTER_ALL) return [...leads]
  return leads.filter((lead) => lead.status === statusTab)
}

function applyLeadListFilters(
  leads: Lead[],
  filters: {
    sourceFilters: string[]
    ownerFilters: string[]
    leadTypeFilters: string[]
    searchQuery: string
    users: readonly DemoUser[]
    contacts: readonly CrmContact[]
  },
): Lead[] {
  const searchNormalized = filters.searchQuery.trim().toLowerCase()

  return leads.filter((lead) => {
    if (
      filters.sourceFilters.length > 0 &&
      !filters.sourceFilters.includes(lead.source)
    ) {
      return false
    }
    if (
      filters.ownerFilters.length > 0 &&
      !filters.ownerFilters.includes(lead.ownerId)
    ) {
      return false
    }
    if (filters.leadTypeFilters.length > 0) {
      const typeKey = lead.leadType ?? LEAD_TYPE_NONE
      if (!filters.leadTypeFilters.includes(typeKey)) return false
    }
    if (!searchNormalized) return true
    const row = buildLeadTableRow(lead, filters.users, filters.contacts)
    return row._filter.includes(searchNormalized)
  })
}

export function LeadsTable() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { leads, users, contacts } = useDemoData()
  const [statusTab, setStatusTab] = React.useState<StatusTabValue>(FILTER_ALL)
  const [sourceFilters, setSourceFilters] = React.useState<string[]>([])
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [leadTypeFilters, setLeadTypeFilters] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<LeadsViewMode>("kanban")
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false)

  const showOwnerColumn = user?.role !== "advisor"

  const columns = React.useMemo(
    () => createLeadsColumns({ users, contacts, showOwnerColumn }),
    [users, contacts, showOwnerColumn],
  )

  const leadGroupingOptions = React.useMemo(
    () => createLeadGroupingOptions(showOwnerColumn),
    [showOwnerColumn],
  )

  const scopedLeads = React.useMemo(() => {
    if (!user) return []
    return filterByScope(leads, user)
  }, [leads, user])

  const statusCounts = React.useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      new: 0,
      in_progress: 0,
      won: 0,
      lost: 0,
    }
    for (const lead of scopedLeads) {
      counts[lead.status] += 1
    }
    return {
      all: scopedLeads.length,
      ...counts,
    }
  }, [scopedLeads])

  const statusScopedLeads = React.useMemo(
    () =>
      viewMode === "table"
        ? filterByStatusTab(scopedLeads, statusTab)
        : [...scopedLeads],
    [scopedLeads, statusTab, viewMode],
  )

  const filterInput = React.useMemo(
    () => ({
      sourceFilters,
      ownerFilters: showOwnerColumn ? ownerFilters : [],
      leadTypeFilters,
      searchQuery,
      users,
      contacts,
    }),
    [
      sourceFilters,
      ownerFilters,
      leadTypeFilters,
      searchQuery,
      users,
      contacts,
      showOwnerColumn,
    ],
  )

  const filteredLeads = React.useMemo(
    () => applyLeadListFilters(statusScopedLeads, filterInput),
    [statusScopedLeads, filterInput],
  )

  const ownerNameById = React.useMemo(
    () => new Map(users.map((u) => [u.id, u.displayName])),
    [users],
  )

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const lead of statusScopedLeads) {
      counts.set(lead.ownerId, (counts.get(lead.ownerId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([ownerId, count]) => ({
        label: ownerNameById.get(ownerId) ?? ownerId,
        value: ownerId,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [statusScopedLeads, ownerNameById])

  const sourceFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const lead of statusScopedLeads) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1)
    }
    return (Object.keys(LEAD_SOURCE_LABELS) as LeadSource[])
      .map((source) => ({
        label: LEAD_SOURCE_LABELS[source],
        value: source,
        count: counts.get(source) ?? 0,
      }))
      .filter((opt) => opt.count > 0)
  }, [statusScopedLeads])

  const leadTypeFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const lead of statusScopedLeads) {
      const key = lead.leadType ?? LEAD_TYPE_NONE
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    const options: { label: string; value: string; count: number }[] = []
    if ((counts.get(LEAD_TYPE_NONE) ?? 0) > 0) {
      options.push({
        label: "Brak",
        value: LEAD_TYPE_NONE,
        count: counts.get(LEAD_TYPE_NONE) ?? 0,
      })
    }
    for (const type of Object.keys(LEAD_TYPE_LABELS) as LeadType[]) {
      const count = counts.get(type) ?? 0
      if (count > 0) {
        options.push({
          label: LEAD_TYPE_LABELS[type],
          value: type,
          count,
        })
      }
    }
    return options.sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [statusScopedLeads])

  const tableData = React.useMemo(
    (): LeadTableRow[] =>
      filteredLeads.map((lead) => buildLeadTableRow(lead, users, contacts)),
    [filteredLeads, users, contacts],
  )

  const resultCountLabel = React.useMemo(() => {
    const n = filteredLeads.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [filteredLeads.length])

  if (!isReady || !user) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm" className="gap-3">
        <CardHeader className="flex flex-col gap-2 pb-3">
          <div className="flex w-full min-w-0 items-center gap-2">
            <CardTitle className="shrink-0 text-xl">Leady</CardTitle>
            <div
              className="flex shrink-0 items-center rounded-md border border-border p-0.5"
              role="group"
              aria-label="Widok listy leadów"
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
                placeholder="Szukaj leadów"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Szukaj leadów"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end" className="tabular-nums">
                {resultCountLabel}
              </InputGroupAddon>
            </InputGroup>
            <div className="shrink-0">
              <LeadFormDialog
                open={createSheetOpen}
                onOpenChange={setCreateSheetOpen}
                trigger={
                  <Button size="lg" onClick={() => setCreateSheetOpen(true)}>
                    <PlusIcon />
                    Nowy lead
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
                  {LEAD_STATUS_OPTIONS.map((status) => (
                    <TabsTrigger key={status} value={status}>
                      {LEAD_STATUS_LABELS[status]}
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
            {showOwnerColumn ? (
              <DataTableFacetedFilter
                title="Opiekun"
                options={ownerFacetedOptions}
                selectedValues={ownerFilters}
                onSelectedValuesChange={setOwnerFilters}
              />
            ) : null}
            <DataTableFacetedFilter
              title="Typ leada"
              options={leadTypeFacetedOptions}
              selectedValues={leadTypeFilters}
              onSelectedValuesChange={setLeadTypeFilters}
            />
          </div>
        </CardHeader>
      </Card>

      {scopedLeads.length === 0 ? (
        <Card size="sm" className="gap-3">
          <CardContent className="pt-3">
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserPlusIcon />
                </EmptyMedia>
                <EmptyTitle>Brak leadów</EmptyTitle>
                <EmptyDescription>
                  Dodaj pierwszy lead przyciskiem „Nowy lead”.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : viewMode === "kanban" ? (
        filteredLeads.length === 0 ? (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyTitle>Brak wyników</EmptyTitle>
              <EmptyDescription>
                Zmień filtry lub wyszukiwanie, aby zobaczyć leady na tablicy.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <LeadsKanbanBoard
            leads={filteredLeads}
            onAddLead={() => setCreateSheetOpen(true)}
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
              showToolbar={scopedLeads.length > 0}
              groupingOptions={leadGroupingOptions}
              onRowClick={(row) => router.push(`/leads/${row.id}`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
