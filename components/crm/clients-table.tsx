"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2Icon, SearchIcon } from "lucide-react"
import {
  createClientsColumns,
  type ClientTableRow,
} from "@/components/crm/clients-columns"
import { CompanyFormDialog } from "@/components/crm/company-form-dialog"
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
import {
  COMPANY_SOURCE_LABELS,
  COMPANY_TYPE_LABELS,
} from "@/lib/crm/company-labels"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import { filterByScope } from "@/lib/rbac/scope"
import type { CompanySource, CompanyType } from "@/types/crm"

const FILTER_ALL = "all"

const CLIENT_GROUPING_OPTIONS = [
  { columnId: "companyType", label: "Typ firmy" },
  { columnId: "ownerName", label: "Opiekun" },
  { columnId: "source", label: "Źródło" },
  { columnId: "segment", label: "Segment" },
] as const

type TypeTabValue = typeof FILTER_ALL | CompanyType

export function ClientsTable() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { clients, users } = useDemoData()
  const [typeTab, setTypeTab] = React.useState<TypeTabValue>(FILTER_ALL)
  const [segmentFilters, setSegmentFilters] = React.useState<string[]>([])
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [sourceFilters, setSourceFilters] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const scopedClients = React.useMemo(
    () => (user ? filterByScope(clients, user) : []),
    [clients, user],
  )

  const columns = React.useMemo(() => createClientsColumns(), [])

  const typeScopedClients = React.useMemo(() => {
    if (typeTab === FILTER_ALL) return scopedClients
    return scopedClients.filter((c) => c.companyType === typeTab)
  }, [scopedClients, typeTab])

  const typeCounts = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of scopedClients) {
      counts.set(c.companyType, (counts.get(c.companyType) ?? 0) + 1)
    }
    return counts
  }, [scopedClients])

  const ownerNameById = React.useMemo(
    () => new Map(users.map((u) => [u.id, u.displayName])),
    [users],
  )

  const segmentFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of typeScopedClients) {
      const segment = c.segment.trim() || "—"
      counts.set(segment, (counts.get(segment) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([segment, count]) => ({
        label: segment,
        value: segment,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [typeScopedClients])

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of typeScopedClients) {
      counts.set(c.ownerId, (counts.get(c.ownerId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([ownerId, count]) => ({
        label: ownerNameById.get(ownerId) ?? ownerId,
        value: ownerId,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [typeScopedClients, ownerNameById])

  const sourceFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of typeScopedClients) {
      if (!c.source) continue
      counts.set(c.source, (counts.get(c.source) ?? 0) + 1)
    }
    return (Object.keys(COMPANY_SOURCE_LABELS) as CompanySource[])
      .map((source) => ({
        label: COMPANY_SOURCE_LABELS[source],
        value: source,
        count: counts.get(source) ?? 0,
      }))
      .filter((opt) => opt.count > 0)
  }, [typeScopedClients])

  const tableData = React.useMemo((): ClientTableRow[] => {
    if (!user) return []
    const searchNormalized = searchQuery.trim().toLowerCase()

    return typeScopedClients
      .filter((client) => {
        const segmentKey = client.segment.trim() || "—"
        if (
          segmentFilters.length > 0 &&
          !segmentFilters.includes(segmentKey)
        ) {
          return false
        }
        if (
          ownerFilters.length > 0 &&
          !ownerFilters.includes(client.ownerId)
        ) {
          return false
        }
        if (
          sourceFilters.length > 0 &&
          (!client.source || !sourceFilters.includes(client.source))
        ) {
          return false
        }
        return true
      })
      .map((client) => {
        const ownerName = ownerNameById.get(client.ownerId) ?? "—"
        return {
          ...client,
          ownerName,
          _filter: `${client.name} ${client.emails.join(" ")} ${client.phones.join(" ")} ${ownerName} ${client.segment} ${COMPANY_TYPE_LABELS[client.companyType]}`.toLowerCase(),
        }
      })
      .filter(
        (row) =>
          !searchNormalized || row._filter.includes(searchNormalized),
      )
  }, [
    typeScopedClients,
    segmentFilters,
    ownerFilters,
    sourceFilters,
    searchQuery,
    user,
    ownerNameById,
  ])

  const resultCountLabel = React.useMemo(() => {
    const n = tableData.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [tableData.length])

  if (!isReady || !user) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm" className="gap-3">
        <CardHeader className="flex flex-col gap-2 pb-0">
          <div className="flex w-full min-w-0 items-center gap-2">
            <CardTitle className="shrink-0 text-xl">Firmy</CardTitle>
            <InputGroup className="h-9 min-h-9 min-w-0 flex-1 basis-0">
              <InputGroupInput
                type="search"
                placeholder="Szukaj firm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Szukaj firm"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end" className="tabular-nums">
                {resultCountLabel}
              </InputGroupAddon>
            </InputGroup>
            <div className="shrink-0">
              <CompanyFormDialog />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              value={typeTab}
              onValueChange={(value) => setTypeTab(value as TypeTabValue)}
            >
              <TabsList className="w-fit">
                <TabsTrigger value={FILTER_ALL}>
                  Wszystkie
                  <span className="text-muted-foreground tabular-nums">
                    ({scopedClients.length})
                  </span>
                </TabsTrigger>
                {(
                  [
                    "active_client",
                    "potential_client",
                    "former_client",
                  ] as const
                ).map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {COMPANY_TYPE_LABELS[type]}
                    <span className="text-muted-foreground tabular-nums">
                      ({typeCounts.get(type) ?? 0})
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <DataTableFacetedFilter
              title="Segment"
              options={segmentFacetedOptions}
              selectedValues={segmentFilters}
              onSelectedValuesChange={setSegmentFilters}
            />
            <DataTableFacetedFilter
              title="Opiekun"
              options={ownerFacetedOptions}
              selectedValues={ownerFilters}
              onSelectedValuesChange={setOwnerFilters}
            />
            <DataTableFacetedFilter
              title="Źródło"
              options={sourceFacetedOptions}
              selectedValues={sourceFilters}
              onSelectedValuesChange={setSourceFilters}
            />
          </div>
        </CardHeader>
      </Card>

      <Card size="sm" className="gap-3">
        <CardContent className="pt-3">
          {scopedClients.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building2Icon />
                </EmptyMedia>
                <EmptyTitle>Brak firm</EmptyTitle>
                <EmptyDescription>
                  W Twoim zakresie nie ma jeszcze firm — dodaj pierwszą
                  przyciskiem u góry.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              columns={columns}
              data={tableData}
              emptyMessage="Brak wyników dla podanych filtrów."
              initialSorting={[{ id: "lastActivityAt", desc: true }]}
              showSearchInToolbar={false}
              showToolbar={scopedClients.length > 0}
              groupingOptions={[...CLIENT_GROUPING_OPTIONS]}
              onRowClick={(row) => router.push(`/clients/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
