"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  type EventProps,
  type View,
} from "react-big-calendar"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
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
import { getCalendarOwnerStyle } from "@/lib/crm/calendar-owner-styles"
import { filterByScope } from "@/lib/rbac/scope"
import type { Client, DemoUser, Meeting } from "@/types/crm"

import "@/app/crm-big-calendar.css"

export type MeetingCalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  clientName: string
  ownerId: string
  ownerName: string
  eventStyle: { backgroundColor: string; color: string }
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
  ownerName: string,
  sortedOwnerIds: readonly string[],
  teamCalendar: boolean,
): MeetingCalendarEvent {
  const eventStyle = teamCalendar
    ? (() => {
        const style = getCalendarOwnerStyle(meeting.ownerId, sortedOwnerIds)
        return {
          backgroundColor: style.bg,
          color: style.fg,
        }
      })()
    : {
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
      }
  return {
    id: meeting.id,
    title: meeting.title,
    start: new Date(meeting.startsAt),
    end: new Date(meeting.endsAt),
    clientName: clientName ?? "—",
    ownerId: meeting.ownerId,
    ownerName,
    eventStyle,
    resource: meeting,
  }
}

type MeetingEventContentProps = EventProps<MeetingCalendarEvent> & {
  showOwner: boolean
}

function MeetingEventContent({ event, showOwner }: MeetingEventContentProps) {
  return (
    <div className="flex h-full flex-col gap-0.5 overflow-hidden px-1.5 py-1 text-xs leading-tight">
      <span className="truncate font-medium">{event.title}</span>
      <span className="truncate opacity-90">{event.clientName}</span>
      {showOwner ? (
        <span className="truncate opacity-80">{event.ownerName}</span>
      ) : null}
    </div>
  )
}

function showsTeamCalendar(user: DemoUser): boolean {
  return user.role === "regional_manager" || user.role === "executive"
}

function getTeamCalendarOwnerIds(
  user: DemoUser,
  users: readonly DemoUser[],
  visibleMeetings: readonly Meeting[],
): string[] {
  const meetingOwnerIds = visibleMeetings.map((meeting) => meeting.ownerId)

  if (user.role === "regional_manager" && user.regionId) {
    const regionMemberIds = users
      .filter(
        (member) =>
          member.regionId === user.regionId &&
          (member.role === "advisor" || member.role === "regional_manager"),
      )
      .map((member) => member.id)
    return [...new Set([...regionMemberIds, ...meetingOwnerIds])].sort(
      (a, b) => {
        const nameA = users.find((u) => u.id === a)?.displayName ?? a
        const nameB = users.find((u) => u.id === b)?.displayName ?? b
        return nameA.localeCompare(nameB, "pl")
      },
    )
  }

  if (user.role === "executive") {
    return [...new Set(meetingOwnerIds)].sort((a, b) => {
      const nameA = users.find((u) => u.id === a)?.displayName ?? a
      const nameB = users.find((u) => u.id === b)?.displayName ?? b
      return nameA.localeCompare(nameB, "pl")
    })
  }

  return []
}

export function CalendarWeekView() {
  const router = useRouter()
  const { user, isReady } = useSession()
  const { meetings, clients, users } = useDemoData()
  const [currentDate, setCurrentDate] = React.useState(() => new Date())
  const [ownerFilters, setOwnerFilters] = React.useState<string[]>([])

  const weekDays = React.useMemo(
    () => getWeekDays(currentDate),
    [currentDate],
  )

  const ownerNameById = React.useMemo(
    () => new Map(users.map((u) => [u.id, u.displayName])),
    [users],
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

  const teamCalendar = user ? showsTeamCalendar(user) : false

  const sortedOwnerIds = React.useMemo(() => {
    if (!user || !teamCalendar) {
      const ids = new Set(visibleMeetings.map((m) => m.ownerId))
      return [...ids].sort((a, b) => {
        const nameA = ownerNameById.get(a) ?? a
        const nameB = ownerNameById.get(b) ?? b
        return nameA.localeCompare(nameB, "pl")
      })
    }
    return getTeamCalendarOwnerIds(user, users, visibleMeetings)
  }, [user, users, visibleMeetings, teamCalendar, ownerNameById])

  const ownerFacetedOptions = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const meeting of visibleMeetings) {
      counts.set(meeting.ownerId, (counts.get(meeting.ownerId) ?? 0) + 1)
    }
    return sortedOwnerIds.map((ownerId) => ({
      label: ownerNameById.get(ownerId) ?? ownerId,
      value: ownerId,
      count: counts.get(ownerId) ?? 0,
    }))
  }, [visibleMeetings, sortedOwnerIds, ownerNameById])

  const filteredMeetings = React.useMemo(() => {
    if (!teamCalendar || ownerFilters.length === 0) {
      return visibleMeetings
    }
    const allowed = new Set(ownerFilters)
    return visibleMeetings.filter((meeting) => allowed.has(meeting.ownerId))
  }, [visibleMeetings, ownerFilters, teamCalendar])

  const events = React.useMemo(
    () =>
      filteredMeetings.map((meeting) =>
        toCalendarEvent(
          meeting,
          clientNameById.get(meeting.clientId),
          ownerNameById.get(meeting.ownerId) ?? meeting.ownerId,
          sortedOwnerIds,
          teamCalendar,
        ),
      ),
    [filteredMeetings, clientNameById, ownerNameById, sortedOwnerIds, teamCalendar],
  )

  const meetingsThisWeek = React.useMemo(() => {
    const weekStart = weekDays[0]?.getTime() ?? 0
    const weekEnd =
      weekDays.length > 0
        ? new Date(weekDays[weekDays.length - 1])
        : new Date()
    weekEnd.setHours(23, 59, 59, 999)
    return filteredMeetings.filter((meeting) => {
      const start = new Date(meeting.startsAt).getTime()
      return start >= weekStart && start <= weekEnd.getTime()
    })
  }, [filteredMeetings, weekDays])

  const scrollToTime = React.useMemo(() => {
    const d = new Date()
    d.setHours(SCROLL_TO_HOUR, 0, 0, 0)
    return d
  }, [])

  const meetingEventContent = React.useMemo(
    () =>
      function CalendarMeetingEventContent(
        props: EventProps<MeetingCalendarEvent>,
      ) {
        return <MeetingEventContent {...props} showOwner={teamCalendar} />
      },
    [teamCalendar],
  )

  if (!isReady || !user) {
    return null
  }

  const weekRangeLabel = formatWeekRangePl(weekDays)
  const scopeLabel = teamCalendar ? "zespołu" : "Twoim zakresie"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">Kalendarz</h1>
          <p className="text-sm text-muted-foreground">
            Tydzień {weekRangeLabel} · {meetingsThisWeek.length}{" "}
            {meetingsThisWeek.length === 1 ? "spotkanie" : "spotkań"} w{" "}
            {scopeLabel}
          </p>
        </div>
        <MeetingFormDialog user={user} />
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Widok tygodnia</CardTitle>
            <CardDescription>
              {teamCalendar
                ? "Spotkania zespołu w regionie (menedżer i doradcy) — kolory wg opiekuna; kliknij spotkanie, aby przejść do karty klienta"
                : "Przeciągnij tygodnie w pasku narzędzi — kliknij spotkanie, aby przejść do karty klienta"}
            </CardDescription>
          </div>
          {teamCalendar && ownerFacetedOptions.length > 0 ? (
            <div className="w-fit">
              <DataTableFacetedFilter
                title="Opiekun"
                options={ownerFacetedOptions}
                selectedValues={ownerFilters}
                onSelectedValuesChange={setOwnerFilters}
              />
            </div>
          ) : null}
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
              components={{ event: meetingEventContent }}
              eventPropGetter={(event) => ({
                style: event.eventStyle,
              })}
              onSelectEvent={(event) => {
                router.push(`/clients/${event.resource.clientId}`)
              }}
              tooltipAccessor={(event) => {
                const client = clientNameById.get(event.resource.clientId)
                const note = event.resource.note
                const parts = [event.title, client, note]
                if (teamCalendar) {
                  parts.push(event.ownerName)
                }
                return parts.filter(Boolean).join(" · ")
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
