"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ActivityIcon, SearchIcon } from "lucide-react"
import { createTeamActivitiesColumns } from "@/components/crm/team-activities-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import {
  Card,
  CardContent,
  CardDescription,
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
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  buildTeamActivityRows,
  getRegionTeamMemberIds,
  TEAM_ACTIVITY_ENTITY_LABELS,
  type TeamActivityEntityType,
  type TeamActivityRow,
} from "@/lib/crm/team-activities"

export function TeamActivitiesTable() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const {
    users,
    contactEvents,
    leadActivities,
    dealActivities,
    clients,
    leads,
    deals,
  } = useDemoData()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])
  const [entityTypeFilters, setEntityTypeFilters] = React.useState<string[]>(
    [],
  )

  React.useEffect(() => {
    if (!isReady || !user) return
    if (user.role !== "regional_manager") {
      router.replace("/pipeline")
    }
  }, [isReady, user, router])

  const allRows = React.useMemo(() => {
    if (!user || user.role !== "regional_manager") return []
    return buildTeamActivityRows({
      user,
      users,
      contactEvents,
      leadActivities,
      dealActivities,
      clients,
      leads,
      deals,
    })
  }, [
    user,
    users,
    contactEvents,
    leadActivities,
    dealActivities,
    clients,
    leads,
    deals,
  ])

  const ownerNameById = React.useMemo(
    () => new Map(users.map((entry) => [entry.id, entry.displayName])),
    [users],
  )

  const teamMemberIds = React.useMemo(
    () => (user ? getRegionTeamMemberIds(user, users) : []),
    [user, users],
  )

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of allRows) {
      counts.set(row.ownerId, (counts.get(row.ownerId) ?? 0) + 1)
    }
    const ownerIds = [
      ...new Set([...teamMemberIds, ...counts.keys()]),
    ].sort((a, b) => {
      const nameA = ownerNameById.get(a) ?? a
      const nameB = ownerNameById.get(b) ?? b
      return nameA.localeCompare(nameB, "pl")
    })
    return ownerIds.map((ownerId) => ({
      label: ownerNameById.get(ownerId) ?? ownerId,
      value: ownerId,
      count: counts.get(ownerId) ?? 0,
    }))
  }, [allRows, teamMemberIds, ownerNameById])

  const entityTypeFacetedOptions = React.useMemo(() => {
    const counts = new Map<TeamActivityEntityType, number>()
    for (const row of allRows) {
      counts.set(row.entityType, (counts.get(row.entityType) ?? 0) + 1)
    }
    return (Object.keys(TEAM_ACTIVITY_ENTITY_LABELS) as TeamActivityEntityType[])
      .filter((type) => (counts.get(type) ?? 0) > 0)
      .map((type) => ({
        label: TEAM_ACTIVITY_ENTITY_LABELS[type],
        value: type,
        count: counts.get(type) ?? 0,
      }))
  }, [allRows])

  const filteredRows = React.useMemo(() => {
    let rows = allRows
    if (ownerFilters.length > 0) {
      const allowed = new Set(ownerFilters)
      rows = rows.filter((row) => allowed.has(row.ownerId))
    }
    if (entityTypeFilters.length > 0) {
      const allowed = new Set(entityTypeFilters)
      rows = rows.filter((row) => allowed.has(row.entityType))
    }
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      rows = rows.filter((row) => row._filter.includes(query))
    }
    return rows
  }, [allRows, ownerFilters, entityTypeFilters, searchQuery])

  const columns = React.useMemo(() => createTeamActivitiesColumns(), [])

  if (!isReady || !user || user.role !== "regional_manager") {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Aktywność zespołu
        </h1>
        <p className="text-sm text-muted-foreground">
          Aktywności i notatki doradców w regionie — kliknij wiersz, aby przejść
          do szczegółów na karcie firmy, leada lub deala
        </p>
      </div>

      <Card size="sm" className="gap-3">
        <CardHeader className="gap-3">
          <CardTitle className="text-base">Filtry</CardTitle>
          <CardDescription>
            {allRows.length}{" "}
            {allRows.length === 1 ? "aktywność" : "aktywności"} w regionie
          </CardDescription>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj po tytule, notatce, firmie lub opiekunie…"
            />
          </InputGroup>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-fit">
              <DataTableFacetedFilter
                title="Opiekun"
                options={ownerFacetedOptions}
                selectedValues={ownerFilters}
                onSelectedValuesChange={setOwnerFilters}
              />
            </div>
            <div className="w-fit">
              <DataTableFacetedFilter
                title="Typ"
                options={entityTypeFacetedOptions}
                selectedValues={entityTypeFilters}
                onSelectedValuesChange={setEntityTypeFilters}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm" className="gap-3">
        <CardContent className="pt-3">
          {filteredRows.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ActivityIcon />
                </EmptyMedia>
                <EmptyTitle>Brak aktywności</EmptyTitle>
                <EmptyDescription>
                  Zmień filtry lub poczekaj na nowe wpisy zespołu.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              columns={columns}
              data={filteredRows}
              onRowClick={(row: TeamActivityRow) => {
                router.push(row.detailHref)
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
