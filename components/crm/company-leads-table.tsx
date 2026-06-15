"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, UserPlusIcon } from "lucide-react"
import {
  buildLeadTableRow,
  createLeadsColumns,
  type LeadTableRow,
} from "@/components/crm/leads-columns"
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
import type {
  CrmContact,
  DemoUser,
  Lead,
  LeadSource,
  LeadStatus,
  LeadType,
} from "@/types/crm"

type CompanyLeadsTableProps = {
  leads: Lead[]
}

const FILTER_ALL = "all"
const LEAD_TYPE_NONE = "__none__"

type StatusTabValue = typeof FILTER_ALL | LeadStatus

function createLeadGroupingOptions(showOwnerColumn: boolean) {
  const options = [
    { columnId: "status", label: "Status" },
    { columnId: "source", label: "Źródło" },
    { columnId: "leadType", label: "Typ" },
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

export function CompanyLeadsTable({ leads }: CompanyLeadsTableProps) {
  const router = useRouter()
  const { user } = useSession()
  const { users, contacts } = useDemoData()
  const [statusTab, setStatusTab] = React.useState<StatusTabValue>(FILTER_ALL)
  const [sourceFilters, setSourceFilters] = React.useState<string[]>([])
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [leadTypeFilters, setLeadTypeFilters] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const showOwnerColumn = user?.role !== "advisor"

  const columns = React.useMemo(
    () =>
      createLeadsColumns({
        users,
        contacts,
        showOwnerColumn,
        showCompanyColumn: false,
      }),
    [users, contacts, showOwnerColumn],
  )

  const leadGroupingOptions = React.useMemo(
    () => createLeadGroupingOptions(showOwnerColumn),
    [showOwnerColumn],
  )

  const statusCounts = React.useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      new: 0,
      in_progress: 0,
      won: 0,
      lost: 0,
    }
    for (const lead of leads) {
      counts[lead.status] += 1
    }
    return {
      all: leads.length,
      ...counts,
    }
  }, [leads])

  const statusScopedLeads = React.useMemo(
    () => filterByStatusTab(leads, statusTab),
    [leads, statusTab],
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

  return (
    <Card size="sm" id="company-leads-section">
      <CardHeader className="flex flex-col gap-3 pb-2">
        <CardTitle className="text-base">Leady</CardTitle>
        <InputGroup className="max-w-md">
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
        {leads.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              value={statusTab}
              onValueChange={(value) => setStatusTab(value as StatusTabValue)}
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
        ) : null}
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserPlusIcon />
              </EmptyMedia>
              <EmptyTitle>Brak leadów</EmptyTitle>
              <EmptyDescription>
                Brak leadów powiązanych z tą firmą.
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
            showToolbar={leads.length > 0}
            groupingOptions={leadGroupingOptions}
            onRowClick={(row) => router.push(`/leads/${row.id}`)}
          />
        )}
      </CardContent>
    </Card>
  )
}
