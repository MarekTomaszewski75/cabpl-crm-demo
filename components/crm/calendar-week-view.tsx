"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  type EventProps,
  type View,
} from "react-big-calendar"
import { MeetingFormDialog } from "@/components/crm/meeting-form-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSession } from "@/lib/auth/demo-session"
import { useDemoData } from "@/lib/data/demo-data-context"
import {
  CALENDAR_CULTURE,
  calendarLocalizer,
  calendarMessagesPl,
} from "@/lib/crm/big-calendar-localizer"
import { formatWeekRangePl, getWeekDays } from "@/lib/crm/calendar-week"
import { filterByScope } from "@/lib/rbac/scope"
import type { Client, Meeting } from "@/types/crm"

import "@/app/crm-big-calendar.css"

export type MeetingCalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  clientName: string
  resource: Meeting
}

const CALENDAR_VIEWS: View[] = ["week"]
const SCROLL_TO_HOUR = 8

function sortMeetingsByStart(a: Meeting, b: Meeting): number {
  return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
}

function toCalendarEvent(
  meeting: Meeting,
  clientName: string | undefined,
): MeetingCalendarEvent {
  return {
    id: meeting.id,
    title: meeting.title,
    start: new Date(meeting.startsAt),
    end: new Date(meeting.endsAt),
    clientName: clientName ?? "—",
    resource: meeting,
  }
}

function MeetingEventContent({ event }: EventProps<MeetingCalendarEvent>) {
  return (
    <div className="flex h-full flex-col gap-0.5 overflow-hidden px-1.5 py-1 text-xs leading-tight">
      <span className="truncate font-medium">{event.title}</span>
      <span className="truncate opacity-90">{event.clientName}</span>
    </div>
  )
}

export function CalendarWeekView() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { meetings, clients } = useDemoData()
  const [currentDate, setCurrentDate] = React.useState(() => new Date())

  const weekDays = React.useMemo(
    () => getWeekDays(currentDate),
    [currentDate],
  )

  const clientNameById = React.useMemo(() => {
    const scoped = user ? filterByScope(clients, user) : []
    return new Map(scoped.map((c: Client) => [c.id, c.name]))
  }, [clients, user])

  const visibleMeetings = React.useMemo(() => {
    if (!user) {
      return []
    }
    return filterByScope(meetings, user).sort(sortMeetingsByStart)
  }, [meetings, user])

  const events = React.useMemo(
    () =>
      visibleMeetings.map((meeting) =>
        toCalendarEvent(meeting, clientNameById.get(meeting.clientId)),
      ),
    [visibleMeetings, clientNameById],
  )

  const meetingsThisWeek = React.useMemo(() => {
    const weekStart = weekDays[0]?.getTime() ?? 0
    const weekEnd =
      weekDays.length > 0
        ? new Date(weekDays[weekDays.length - 1])
        : new Date()
    weekEnd.setHours(23, 59, 59, 999)
    return visibleMeetings.filter((meeting) => {
      const start = new Date(meeting.startsAt).getTime()
      return start >= weekStart && start <= weekEnd.getTime()
    })
  }, [visibleMeetings, weekDays])

  const scrollToTime = React.useMemo(() => {
    const d = new Date()
    d.setHours(SCROLL_TO_HOUR, 0, 0, 0)
    return d
  }, [])

  if (!isReady || !user) {
    return null
  }

  const weekRangeLabel = formatWeekRangePl(weekDays)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">Kalendarz</h1>
          <p className="text-sm text-muted-foreground">
            Tydzień {weekRangeLabel} · {meetingsThisWeek.length}{" "}
            {meetingsThisWeek.length === 1 ? "spotkanie" : "spotkań"} w Twoim
            zakresie
          </p>
        </div>
        <MeetingFormDialog user={user} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Widok tygodnia</CardTitle>
          <CardDescription>
            Przeciągnij tygodnie w pasku narzędzi — kliknij spotkanie, aby
            przejść do karty klienta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="crm-big-calendar min-h-[36rem]">
            <Calendar<MeetingCalendarEvent>
              localizer={calendarLocalizer}
              culture={CALENDAR_CULTURE}
              messages={calendarMessagesPl}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view="week"
              views={CALENDAR_VIEWS}
              date={currentDate}
              onNavigate={setCurrentDate}
              scrollToTime={scrollToTime}
              popup
              selectable={false}
              style={{ height: "36rem" }}
              components={{ event: MeetingEventContent }}
              onSelectEvent={(event) => {
                router.push(`/clients/${event.resource.clientId}`)
              }}
              tooltipAccessor={(event) => {
                const client = clientNameById.get(event.resource.clientId)
                const note = event.resource.note
                return [event.title, client, note].filter(Boolean).join(" · ")
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
