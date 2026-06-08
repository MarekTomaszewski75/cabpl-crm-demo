import { toLocalDateKey } from "@/lib/crm/demo-today"
import {
  getClientNbaSuggestions,
  type NbaSuggestion,
} from "@/lib/crm/nba-rules"
import type { Client, ContactEvent, Meeting, Opportunity, Task } from "@/types/crm"

export function getTasksDueOnDate(
  tasks: readonly Task[],
  dateKey: string,
): Task[] {
  return tasks
    .filter((task) => !task.completed && task.dueDate === dateKey)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const diff =
        priorityOrder[a.priority] - priorityOrder[b.priority]
      if (diff !== 0) return diff
      return a.title.localeCompare(b.title, "pl")
    })
}

export function getNextUpcomingMeeting(
  meetings: readonly Meeting[],
  from: Date,
): Meeting | null {
  const fromMs = from.getTime()
  const upcoming = meetings
    .filter((meeting) => new Date(meeting.startsAt).getTime() >= fromMs)
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )
  return upcoming[0] ?? null
}

export type TodayNbaHighlight = {
  client: Client
  suggestion: NbaSuggestion
}

export function getPrimaryNbaHighlight(
  clients: readonly Client[],
  opportunities: readonly Opportunity[],
  contactEvents: readonly ContactEvent[],
  now: Date,
): TodayNbaHighlight | null {
  const priorityRank = { high: 0, medium: 1 }

  let best: TodayNbaHighlight | null = null

  for (const client of clients) {
    const suggestions = getClientNbaSuggestions({
      client,
      opportunities,
      contactEvents,
      now,
    })
    const top = suggestions[0]
    if (!top) continue

    if (
      !best ||
      priorityRank[top.priority] < priorityRank[best.suggestion.priority]
    ) {
      best = { client, suggestion: top }
    }
  }

  return best
}

/** Początek dnia demo (lokalnie) — do filtrowania spotkań „od dziś”. */
export function startOfDemoDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

export function isMeetingOnDate(meeting: Meeting, dateKey: string): boolean {
  return toLocalDateKey(new Date(meeting.startsAt)) === dateKey
}
