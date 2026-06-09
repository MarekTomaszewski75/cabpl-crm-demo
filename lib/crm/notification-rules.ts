import { toLocalDateKey } from "@/lib/crm/demo-today"
import { getLeadsRequiringAttention } from "@/lib/crm/today-pipeline-summary"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Deal,
  DemoUser,
  Lead,
  LeadActivity,
  Meeting,
  Notification,
  Task,
} from "@/types/crm"

/** Horyzont terminu deala dla powiadomień (dni od daty demo). */
export const NOTIFICATION_DEAL_HORIZON_DAYS = 3

/** Horyzont terminu zadania — dziś, jutro lub po terminie. */
export const NOTIFICATION_TASK_HORIZON_DAYS = 1

export type NotificationDataInput = {
  deals: readonly Deal[]
  tasks: readonly Task[]
  leads: readonly Lead[]
  leadActivities: readonly LeadActivity[]
  meetings: readonly Meeting[]
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toComparableDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10)
  return toLocalDateKey(parsed)
}

function parseDateKey(dateKey: string): Date {
  const normalized = toComparableDateKey(dateKey)
  const [year, month, day] = normalized.split("-").map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

function calendarDaysBetween(earlier: Date, later: Date): number {
  const start = startOfLocalDay(earlier)
  const end = startOfLocalDay(later)
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function notificationDedupKey(
  notification: Pick<Notification, "type" | "entityType" | "entityId">,
): string {
  return `${notification.type}:${notification.entityType ?? ""}:${notification.entityId ?? ""}`
}

function formatDaysUntilPl(days: number): string {
  if (days < 0) {
    const overdue = -days
    return overdue === 1 ? "termin wczoraj" : `termin ${overdue} dni temu`
  }
  if (days === 0) return "termin dziś"
  if (days === 1) return "zamknięcie jutro"
  return `zamknięcie za ${days} dni`
}

function formatTaskDuePl(daysUntilDue: number): string {
  if (daysUntilDue < 0) {
    const overdue = -daysUntilDue
    return overdue === 1 ? "termin minął wczoraj" : `termin minął ${overdue} dni temu`
  }
  if (daysUntilDue === 0) return "termin dziś"
  if (daysUntilDue === 1) return "termin jutro"
  return `termin za ${daysUntilDue} dni`
}

function buildDealNotifications(
  deals: readonly Deal[],
  user: DemoUser,
  asOfDate: Date,
): Notification[] {
  const asOfKey = toLocalDateKey(asOfDate)
  const horizonEndKey = toLocalDateKey(
    addCalendarDays(asOfDate, NOTIFICATION_DEAL_HORIZON_DAYS),
  )

  return filterByScope(deals, user)
    .filter((deal) => {
      if (deal.status === "won" || deal.status === "lost") return false
      if (!deal.expectedCloseDate) return false
      const closeKey = toComparableDateKey(deal.expectedCloseDate)
      return closeKey >= asOfKey && closeKey <= horizonEndKey
    })
    .map((deal) => {
      const daysUntil = calendarDaysBetween(
        asOfDate,
        parseDateKey(deal.expectedCloseDate!),
      )
      return {
        id: `gen-deal-${deal.id}`,
        userId: user.id,
        type: "deal_deadline" as const,
        titlePl: "Zbliża się termin deala",
        bodyPl: `${deal.name} — ${formatDaysUntilPl(daysUntil)}`,
        createdAt: asOfDate.toISOString(),
        read: false,
        entityType: "deal" as const,
        entityId: deal.id,
        href: `/pipeline/${deal.id}`,
      }
    })
}

function buildTaskNotifications(
  tasks: readonly Task[],
  user: DemoUser,
  asOfDate: Date,
): Notification[] {
  const horizonEndKey = toLocalDateKey(
    addCalendarDays(asOfDate, NOTIFICATION_TASK_HORIZON_DAYS),
  )

  return filterByScope(tasks, user)
    .filter((task) => {
      if (task.completed) return false
      const dueKey = toComparableDateKey(task.dueDate)
      return dueKey <= horizonEndKey
    })
    .map((task) => {
      const daysUntil = calendarDaysBetween(asOfDate, parseDateKey(task.dueDate))
      const isOverdue = daysUntil < 0
      return {
        id: `gen-task-${task.id}`,
        userId: user.id,
        type: "task_deadline" as const,
        titlePl: isOverdue ? "Zadanie po terminie" : "Zbliża się termin zadania",
        bodyPl: `${task.title} — ${formatTaskDuePl(daysUntil)}`,
        createdAt: asOfDate.toISOString(),
        read: false,
        entityType: "task" as const,
        entityId: task.id,
        href: "/tasks",
      }
    })
}

function buildLeadNotifications(
  leads: readonly Lead[],
  leadActivities: readonly LeadActivity[],
  user: DemoUser,
  asOfDate: Date,
): Notification[] {
  const scopedLeads = filterByScope(leads, user)
  const scopedActivities = filterByScope(leadActivities, user)

  return getLeadsRequiringAttention(scopedLeads, scopedActivities, asOfDate).map(
    ({ lead, daysSinceLastActivity }) => ({
      id: `gen-lead-${lead.id}`,
      userId: user.id,
      type: "lead_stale" as const,
      titlePl: "Lead bez aktywności",
      bodyPl: `${lead.name} — brak kontaktu od ${daysSinceLastActivity} dni`,
      createdAt: asOfDate.toISOString(),
      read: false,
      entityType: "lead" as const,
      entityId: lead.id,
      href: `/leads/${lead.id}`,
    }),
  )
}

function buildMeetingNotifications(
  meetings: readonly Meeting[],
  user: DemoUser,
  asOfDate: Date,
): Notification[] {
  const horizonMs = 24 * 60 * 60 * 1000

  return filterByScope(meetings, user)
    .filter((meeting) => {
      const start = new Date(meeting.startsAt)
      const diffMs = start.getTime() - asOfDate.getTime()
      return diffMs >= 0 && diffMs < horizonMs
    })
    .map((meeting) => {
      const start = new Date(meeting.startsAt)
      const hoursUntil = Math.round(
        (start.getTime() - asOfDate.getTime()) / (60 * 60 * 1000),
      )
      const bodySuffix =
        hoursUntil < 1
          ? "za mniej niż godzinę"
          : hoursUntil === 1
            ? "za 1 godz."
            : `za ${hoursUntil} godz.`

      return {
        id: `gen-meeting-${meeting.id}`,
        userId: user.id,
        type: "meeting_soon" as const,
        titlePl: "Nadchodzące spotkanie",
        bodyPl: `${meeting.title} — ${bodySuffix}`,
        createdAt: asOfDate.toISOString(),
        read: false,
        entityType: "meeting" as const,
        entityId: meeting.id,
        href: "/calendar",
      }
    })
}

export function generateNotificationsForUser(
  user: DemoUser,
  data: NotificationDataInput,
  asOfDate: Date,
): Notification[] {
  return [
    ...buildDealNotifications(data.deals, user, asOfDate),
    ...buildTaskNotifications(data.tasks, user, asOfDate),
    ...buildLeadNotifications(data.leads, data.leadActivities, user, asOfDate),
    ...buildMeetingNotifications(data.meetings, user, asOfDate),
  ]
}

export function mergeSeedAndGeneratedNotifications(
  seed: readonly Notification[],
  generated: readonly Notification[],
): Notification[] {
  const byKey = new Map<string, Notification>()

  for (const notification of generated) {
    byKey.set(notificationDedupKey(notification), notification)
  }
  for (const notification of seed) {
    byKey.set(notificationDedupKey(notification), notification)
  }

  return [...byKey.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
