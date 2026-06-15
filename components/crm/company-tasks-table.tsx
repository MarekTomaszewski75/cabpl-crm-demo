"use client"

import * as React from "react"
import { ListTodoIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"
import { createTasksColumns } from "@/components/crm/tasks-columns"
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
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import type { Task } from "@/types/crm"

type CompanyTasksTableProps = {
  tasks: Task[]
}

export function CompanyTasksTable({ tasks }: CompanyTasksTableProps) {
  const { user } = useSession()
  const { opportunities, users, updateTask } = useDemoData()
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleCompletedChange = React.useCallback(
    (task: Task, checked: boolean) => {
      if (!user) return
      updateTask(task.id, { completed: checked }, user)
      toast.success(
        checked ? "Zadanie oznaczone jako wykonane" : "Zadanie przywrócone",
      )
    },
    [updateTask, user],
  )

  const columns = React.useMemo(
    () =>
      user
        ? createTasksColumns({
            user,
            onCompletedChange: handleCompletedChange,
            showClientColumn: false,
            showOwnerColumn: true,
          })
        : [],
    [user, handleCompletedChange],
  )

  const tableData = React.useMemo(() => {
    const opportunityTitleById = new Map(
      opportunities.map((deal) => [deal.id, deal.name]),
    )
    const ownerNameById = new Map(
      users.map((entry) => [entry.id, entry.displayName]),
    )

    return tasks.map((task) => {
      const opportunityTitle = task.opportunityId
        ? (opportunityTitleById.get(task.opportunityId) ?? null)
        : null
      const ownerName = ownerNameById.get(task.ownerId) ?? "—"
      return {
        ...task,
        clientName: null,
        opportunityTitle,
        ownerName,
        _filter: `${task.title} ${opportunityTitle ?? ""} ${ownerName}`.toLowerCase(),
      }
    })
  }, [tasks, opportunities, users])

  const filteredData = React.useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return tableData
    return tableData.filter((row) => row._filter.includes(normalized))
  }, [tableData, searchQuery])

  const resultCountLabel = React.useMemo(() => {
    const n = filteredData.length
    if (n === 1) return "1 wynik"
    if (n >= 2 && n <= 4) return `${n} wyniki`
    return `${n} wyników`
  }, [filteredData.length])

  if (!user) {
    return null
  }

  return (
    <Card size="sm" id="company-tasks-section">
      <CardHeader className="flex flex-col gap-3 pb-2">
        <CardTitle className="text-base">Zadania</CardTitle>
        {tasks.length > 0 ? (
          <InputGroup className="max-w-md">
            <InputGroupInput
              type="search"
              placeholder="Szukaj po tytule…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Szukaj zadań"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="tabular-nums">
              {resultCountLabel}
            </InputGroupAddon>
          </InputGroup>
        ) : null}
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <Empty className="border py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListTodoIcon />
              </EmptyMedia>
              <EmptyTitle>Brak zadań</EmptyTitle>
              <EmptyDescription>
                Brak zadań powiązanych z tą firmą.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="Brak wyników dla podanego filtra."
            initialSorting={[{ id: "dueDate", desc: false }]}
            showSearchInToolbar={false}
            showToolbar={tasks.length > 0}
            getRowClassName={(row) =>
              row.completed ? "text-muted-foreground" : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  )
}
