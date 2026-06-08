"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, UsersIcon } from "lucide-react"
import {
  createEmployeesColumns,
  formatRolesLabel,
  type EmployeeTableRow,
} from "@/components/crm/employees-columns"
import { EmployeeFormDialog } from "@/components/crm/employee-form-dialog"
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
import { formatEmployeeName } from "@/lib/crm/employee-display"
import { useDemoData } from "@/lib/data/demo-data-context"
import { EMPLOYEE_STATUS_LABELS, type Employee, type EmployeeStatus } from "@/types/crm"

const FILTER_ALL = "all"

const EMPLOYEE_GROUPING_OPTIONS = [
  { columnId: "position", label: "Stanowisko" },
  { columnId: "departmentName", label: "Dział" },
  { columnId: "managerName", label: "Kierownik" },
] as const

type StatusTabValue = typeof FILTER_ALL | EmployeeStatus

function filterByStatusTab(
  employees: readonly Employee[],
  statusTab: StatusTabValue,
): Employee[] {
  if (statusTab === FILTER_ALL) return [...employees]
  return employees.filter((e) => e.status === statusTab)
}

export function EmployeesTable() {
  const router = useRouter()
  const { isReady } = useSession()
  const { employees, departments } = useDemoData()
  const [statusTab, setStatusTab] = React.useState<StatusTabValue>(FILTER_ALL)
  const [departmentFilters, setDepartmentFilters] = React.useState<string[]>(
    [],
  )
  const [managerFilters, setManagerFilters] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const statusCounts = React.useMemo(
    () => ({
      all: employees.length,
      active: employees.filter((e) => e.status === "active").length,
      inactive: employees.filter((e) => e.status === "inactive").length,
    }),
    [employees],
  )

  const columns = React.useMemo(() => createEmployeesColumns(), [])

  const departmentNameById = React.useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    [departments],
  )

  const employeeNameById = React.useMemo(
    () =>
      new Map(
        employees.map((e) => [e.id, formatEmployeeName(e)] as const),
      ),
    [employees],
  )

  const statusScopedEmployees = React.useMemo(
    () => filterByStatusTab(employees, statusTab),
    [employees, statusTab],
  )

  const departmentFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const emp of statusScopedEmployees) {
      counts.set(emp.departmentId, (counts.get(emp.departmentId) ?? 0) + 1)
    }
    return departments
      .map((dept) => ({
        label: dept.name,
        value: dept.id,
        count: counts.get(dept.id) ?? 0,
      }))
      .filter((opt) => opt.count > 0)
  }, [departments, statusScopedEmployees])

  const managerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const emp of statusScopedEmployees) {
      if (!emp.managerId) continue
      counts.set(emp.managerId, (counts.get(emp.managerId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([id, count]) => ({
        label: employeeNameById.get(id) ?? id,
        value: id,
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
  }, [statusScopedEmployees, employeeNameById])

  const tableData = React.useMemo((): EmployeeTableRow[] => {
    const searchNormalized = searchQuery.trim().toLowerCase()

    return statusScopedEmployees
      .filter((emp) => {
        if (
          departmentFilters.length > 0 &&
          !departmentFilters.includes(emp.departmentId)
        ) {
          return false
        }
        if (managerFilters.length > 0) {
          if (!emp.managerId || !managerFilters.includes(emp.managerId)) {
            return false
          }
        }
        return true
      })
      .map((emp) => {
        const fullName = formatEmployeeName(emp)
        const departmentName =
          departmentNameById.get(emp.departmentId) ?? "—"
        const managerName = emp.managerId
          ? (employeeNameById.get(emp.managerId) ?? null)
          : null
        const rolesLabel = formatRolesLabel(emp.crmRoles)
        return {
          ...emp,
          fullName,
          departmentName,
          managerName,
          rolesLabel,
          _filter: `${fullName} ${emp.position} ${departmentName} ${rolesLabel} ${emp.emails.join(" ")}`.toLowerCase(),
        }
      })
      .filter(
        (row) =>
          !searchNormalized || row._filter.includes(searchNormalized),
      )
  }, [
    statusScopedEmployees,
    departmentFilters,
    managerFilters,
    searchQuery,
    departmentNameById,
    employeeNameById,
  ])

  const resultCountLabel = React.useMemo(() => {
    const n = tableData.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [tableData.length])

  if (!isReady) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm" className="gap-3">
        <CardHeader className="flex flex-col gap-2 pb-0">
          <div className="flex w-full min-w-0 items-center gap-2">
            <CardTitle className="shrink-0 text-xl">Pracownicy</CardTitle>
            <InputGroup className="h-9 min-h-9 min-w-0 flex-1 basis-0">
              <InputGroupInput
                type="search"
                placeholder="Szukaj pracowników"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Szukaj pracowników"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end" className="tabular-nums">
                {resultCountLabel}
              </InputGroupAddon>
            </InputGroup>
            <div className="shrink-0">
              <EmployeeFormDialog />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                <TabsTrigger value="active">
                  {EMPLOYEE_STATUS_LABELS.active}
                  <span className="text-muted-foreground tabular-nums">
                    ({statusCounts.active})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  {EMPLOYEE_STATUS_LABELS.inactive}
                  <span className="text-muted-foreground tabular-nums">
                    ({statusCounts.inactive})
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <DataTableFacetedFilter
              title="Dział"
              options={departmentFacetedOptions}
              selectedValues={departmentFilters}
              onSelectedValuesChange={setDepartmentFilters}
            />
            <DataTableFacetedFilter
              title="Kierownik"
              options={managerFacetedOptions}
              selectedValues={managerFilters}
              onSelectedValuesChange={setManagerFilters}
            />
          </div>
        </CardHeader>
      </Card>

      <Card size="sm" className="gap-3">
        <CardContent className="pt-3">
          {employees.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>Brak pracowników</EmptyTitle>
                <EmptyDescription>
                  Dodaj pierwszego pracownika przyciskiem u góry.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              columns={columns}
              data={tableData}
              emptyMessage="Brak wyników dla podanych filtrów."
              initialSorting={[{ id: "fullName", desc: false }]}
              showSearchInToolbar={false}
              showToolbar={employees.length > 0}
              groupingOptions={[...EMPLOYEE_GROUPING_OPTIONS]}
              onRowClick={(row) => router.push(`/employees/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
