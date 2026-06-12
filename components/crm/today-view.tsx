"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  CheckSquareIcon,
  LightbulbIcon,
  SunIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { getPostLoginPath } from "@/lib/auth/post-login-path"
import { useSession } from "@/lib/auth/demo-session"
import {
  formatTodayPl,
  getToday,
  getTodayDateKey,
  startOfDay,
} from "@/lib/crm/local-date"
import { TASK_PRIORITY_LABELS } from "@/lib/crm/task-labels"
import {
  getNextUpcomingMeeting,
  getPrimaryNbaHighlight,
  getTasksDueOnDate,
  isMeetingOnDate,
} from "@/lib/crm/today-dashboard"
import { TodayNotificationsCard } from "@/components/crm/today-notifications-card"
import { TodayPipelineSummary } from "@/components/crm/today-pipeline-summary"
import { useDemoData } from "@/lib/data/demo-data-context"
import { formatDatePl, formatTimePl } from "@/lib/format/pl"
import { filterByScope } from "@/lib/rbac/scope"
import type { Client, TaskPriority } from "@/types/crm"

function priorityBadgeVariant(
  priority: TaskPriority,
): "destructive" | "secondary" | "outline" {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
  }
}

export function TodayView() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { tasks, meetings, clients, opportunities, leads, leadActivities, contactEvents } =
    useDemoData()

  const today = getToday()
  const todayDateKey = getTodayDateKey()

  React.useEffect(() => {
    if (!isReady || !user) return
    if (user.role !== "advisor") {
      router.replace(getPostLoginPath(user))
    }
  }, [isReady, user, router])

  const scopedTasks = React.useMemo(
    () => (user ? filterByScope(tasks, user) : []),
    [tasks, user],
  )
  const scopedMeetings = React.useMemo(
    () => (user ? filterByScope(meetings, user) : []),
    [meetings, user],
  )
  const scopedClients = React.useMemo(
    () => (user ? filterByScope(clients, user) : []),
    [clients, user],
  )
  const scopedOpportunities = React.useMemo(
    () => (user ? filterByScope(opportunities, user) : []),
    [opportunities, user],
  )
  const scopedLeads = React.useMemo(
    () => (user ? filterByScope(leads, user) : []),
    [leads, user],
  )
  const scopedLeadActivities = React.useMemo(
    () => (user ? filterByScope(leadActivities, user) : []),
    [leadActivities, user],
  )
  const scopedContactEvents = React.useMemo(
    () => (user ? filterByScope(contactEvents, user) : []),
    [contactEvents, user],
  )

  const clientNameById = React.useMemo(
    () => new Map(scopedClients.map((c: Client) => [c.id, c.name])),
    [scopedClients],
  )

  const tasksToday = getTasksDueOnDate(scopedTasks, todayDateKey)
  const nextMeeting = getNextUpcomingMeeting(
    scopedMeetings,
    startOfDay(today),
  )
  const nbaHighlight = getPrimaryNbaHighlight(
    scopedClients,
    scopedOpportunities,
    scopedContactEvents,
    today,
  )

  if (!isReady || !user || user.role !== "advisor") {
    return (
      <p className="text-sm text-muted-foreground">Ładowanie widoku „Dziś”…</p>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <SunIcon className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dziś</h1>
            <p className="text-sm text-muted-foreground">
              {formatTodayPl()}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/pipeline">Przejdź do lejka</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquareIcon className="text-primary" />
              Zadania na dziś
            </CardTitle>
            <CardDescription>
              Termin {formatDatePl(todayDateKey)} —{" "}
              {tasksToday.length}{" "}
              {tasksToday.length === 1 ? "otwarte zadanie" : "otwartych zadań"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksToday.length === 0 ? (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CheckSquareIcon />
                  </EmptyMedia>
                  <EmptyTitle>Brak zadań na dziś</EmptyTitle>
                  <EmptyDescription>
                    Sprawdź pełną listę w module Zadania lub dodaj nowe.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="flex flex-col gap-2">
                {tasksToday.map((task) => (
                  <li
                    key={task.id}
                    className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{task.title}</span>
                      <Badge variant={priorityBadgeVariant(task.priority)}>
                        {TASK_PRIORITY_LABELS[task.priority]}
                      </Badge>
                    </div>
                    {task.clientId ? (
                      <p className="text-xs text-muted-foreground">
                        Klient:{" "}
                        {clientNameById.get(task.clientId) ?? task.clientId}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <Button variant="link" className="mt-3 h-auto p-0" asChild>
              <Link href="/tasks">Wszystkie zadania</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="text-primary" />
              Najbliższe spotkanie
            </CardTitle>
            <CardDescription>
              Kolejne w kalendarzu od dziś
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!nextMeeting ? (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarIcon />
                  </EmptyMedia>
                  <EmptyTitle>Brak zaplanowanych spotkań</EmptyTitle>
                  <EmptyDescription>
                    Dodaj spotkanie w kalendarzu tygodnia.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-medium">{nextMeeting.title}</p>
                <p className="text-xs text-muted-foreground">
                  {clientNameById.get(nextMeeting.clientId) ??
                    nextMeeting.clientId}
                </p>
                <p className="text-sm tabular-nums">
                  {formatDatePl(nextMeeting.startsAt)},{" "}
                  {formatTimePl(nextMeeting.startsAt)}–
                  {formatTimePl(nextMeeting.endsAt)}
                  {isMeetingOnDate(nextMeeting, todayDateKey) ? (
                    <Badge variant="secondary" className="ml-2">
                      Dziś
                    </Badge>
                  ) : null}
                </p>
                {nextMeeting.note ? (
                  <p className="text-xs text-muted-foreground">
                    {nextMeeting.note}
                  </p>
                ) : null}
              </div>
            )}
            <Button variant="link" className="mt-3 h-auto p-0" asChild>
              <Link href="/calendar">Kalendarz</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <TodayNotificationsCard />

      <TodayPipelineSummary
        deals={scopedOpportunities}
        leads={scopedLeads}
        leadActivities={scopedLeadActivities}
        clients={scopedClients}
        today={today}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LightbulbIcon className="text-primary" />
            Następny krok (NBA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!nbaHighlight ? (
            <p className="text-sm text-muted-foreground">
              Brak pilnych sugestii w Twoim portfelu — kontynuuj bieżące szanse.
            </p>
          ) : (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    nbaHighlight.suggestion.priority === "high"
                      ? "default"
                      : "secondary"
                  }
                >
                  {nbaHighlight.suggestion.priority === "high"
                    ? "Wysoki priorytet"
                    : "Średni priorytet"}
                </Badge>
                <span className="text-sm font-medium">
                  {nbaHighlight.client.name}
                </span>
              </div>
              <p className="text-sm leading-snug">
                {nbaHighlight.suggestion.message}
              </p>
              <Button variant="outline" size="sm" className="w-fit" asChild>
                <Link href={`/clients/${nbaHighlight.client.id}`}>
                  Otwórz kartę klienta
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
