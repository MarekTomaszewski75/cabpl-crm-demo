"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
  EmptyTitle,
} from "@/components/ui/empty"
import { formatDatePl } from "@/lib/format/pl"
import type { Task } from "@/types/crm"

type LeadTasksListProps = {
  tasks: Task[]
  /** Bez zewnętrznej karty — np. zakładka composera. */
  embedded?: boolean
}

function LeadTasksListBody({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <Empty className="border py-6">
        <EmptyHeader>
          <EmptyTitle>Brak zadań</EmptyTitle>
          <EmptyDescription>
            Brak zadań powiązanych z tym leadem.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/80 px-3 py-2 text-sm"
        >
          <span
            className={
              task.completed
                ? "truncate line-through text-muted-foreground"
                : "truncate font-medium"
            }
          >
            {task.title}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatDatePl(task.dueDate)}
            </span>
            <Badge variant={task.completed ? "secondary" : "outline"}>
              {task.completed ? "Wykonane" : "Otwarte"}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function LeadTasksList({ tasks, embedded = false }: LeadTasksListProps) {
  const viewAllLink = (
    <Link
      href="/tasks"
      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
    >
      Zobacz wszystkie
    </Link>
  )

  if (embedded) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-end">{viewAllLink}</div>
        <LeadTasksListBody tasks={tasks} />
      </div>
    )
  }

  return (
    <Card size="sm" id="lead-tasks-section">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base">Zadania</CardTitle>
        {viewAllLink}
      </CardHeader>
      <CardContent>
        <LeadTasksListBody tasks={tasks} />
      </CardContent>
    </Card>
  )
}
