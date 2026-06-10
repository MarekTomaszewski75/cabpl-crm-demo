"use client"

import * as React from "react"
import { ListTodoIcon } from "lucide-react"
import { toast } from "sonner"
import { createTasksColumns } from "@/components/crm/tasks-columns"
import { TaskFormDialog } from "@/components/crm/task-form-dialog"
import { DataTable } from "@/components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
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
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import { filterByScope } from "@/lib/rbac/scope"
import type { Client, Opportunity, Task } from "@/types/crm"

export function TasksTable() {
  const { user, isReady } = useSession()
  const { tasks, clients, opportunities, updateTask } = useDemoData()

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
        ? createTasksColumns({ user, onCompletedChange: handleCompletedChange })
        : [],
    [user, handleCompletedChange],
  )

  const tableData = React.useMemo(() => {
    if (!user) return []
    const scopedClients = filterByScope(clients, user)
    const scopedOpportunities = filterByScope(opportunities, user)
    const clientNameById = new Map(
      scopedClients.map((c: Client) => [c.id, c.name]),
    )
    const opportunityTitleById = new Map(
      scopedOpportunities.map((o: Opportunity) => [o.id, o.name]),
    )

    return filterByScope(tasks, user).map((task) => {
      const clientName = task.clientId
        ? (clientNameById.get(task.clientId) ?? null)
        : null
      const opportunityTitle = task.opportunityId
        ? (opportunityTitleById.get(task.opportunityId) ?? null)
        : null
      return {
        ...task,
        clientName,
        opportunityTitle,
        _filter: `${task.title} ${clientName ?? ""} ${opportunityTitle ?? ""}`.toLowerCase(),
      }
    })
  }, [tasks, user, clients, opportunities])

  if (!isReady || !user) {
    return null
  }

  const openCount = tableData.filter((t) => !t.completed).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">Zadania</h1>
          <p className="text-sm text-muted-foreground">
            {openCount} otwartych · {tableData.length}{" "}
            {tableData.length === 1 ? "zadanie" : "zadań"} w Twoim zakresie
          </p>
        </div>
        <TaskFormDialog user={user} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Lista zadań</CardTitle>
            <CardDescription>
              Termin, priorytet, powiązanie z klientem lub szansą
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {tableData.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListTodoIcon />
                </EmptyMedia>
                <EmptyTitle>Brak zadań</EmptyTitle>
                <EmptyDescription>
                  Dodaj pierwsze zadanie przyciskiem „Nowe zadanie”.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              columns={columns}
              data={tableData}
              filterPlaceholder="Szukaj po tytule…"
              emptyMessage="Brak wyników dla podanego filtra."
              initialSorting={[{ id: "dueDate", desc: false }]}
              getRowClassName={(row) =>
                row.completed ? "text-muted-foreground" : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
