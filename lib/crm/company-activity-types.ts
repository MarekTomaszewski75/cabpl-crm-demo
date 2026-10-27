import { activityChannelTypeLabel } from "@/lib/crm/activity-channel-types"
import { buildActivityNoteBody } from "@/lib/crm/activity-participants"
import { toLocalDateKey } from "@/lib/crm/local-date"
import type {
  AddCompanyActivityInput,
  ChannelContactEventType,
  CompanyActivityPriority,
  CrmContact,
  DemoUser,
} from "@/types/crm"

export function activityTitlePlaceholder(type: ChannelContactEventType): string {
  return activityChannelTypeLabel(type)
}

export type CompanyActivityPriorityIconKey =
  | "chevrons-up"
  | "chevron-up"
  | "equal"
  | "chevron-down"
  | "chevrons-down"

export type CompanyActivityPriorityOption = {
  id: CompanyActivityPriority
  label: string
  iconBg: string
  iconColor: string
  iconKey: CompanyActivityPriorityIconKey
}

export const COMPANY_ACTIVITY_PRIORITY_OPTIONS: CompanyActivityPriorityOption[] =
  [
    {
      id: "very_high",
      label: "Bardzo wysoki",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-700 dark:text-red-400",
      iconKey: "chevrons-up",
    },
    {
      id: "high",
      label: "Wysoki",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-700 dark:text-orange-400",
      iconKey: "chevron-up",
    },
    {
      id: "neutral",
      label: "Neutralny",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      iconKey: "equal",
    },
    {
      id: "medium",
      label: "Średni",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-700 dark:text-emerald-400",
      iconKey: "chevron-down",
    },
    {
      id: "low",
      label: "Niski",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-700 dark:text-blue-400",
      iconKey: "chevrons-down",
    },
  ]

export function getCompanyActivityPriorityOption(
  id: CompanyActivityPriority,
): CompanyActivityPriorityOption {
  return (
    COMPANY_ACTIVITY_PRIORITY_OPTIONS.find((o) => o.id === id) ??
    COMPANY_ACTIVITY_PRIORITY_OPTIONS[2]
  )
}

export function todayDateInputValue(): string {
  return toLocalDateKey(new Date())
}

const ACTIVITY_DEFAULT_DURATION_MS = 60 * 60 * 1000

/** Data i godzina z formularza to czas lokalny przeglądarki (US-57). */
export function buildActivityOccurredAt(input: {
  startDate: string
  startTime: string
  allDay: boolean
}): string {
  if (!input.startDate) return new Date().toISOString()
  if (input.allDay) return new Date(`${input.startDate}T12:00:00`).toISOString()
  const time = input.startTime || "09:00"
  return new Date(`${input.startDate}T${time}:00`).toISOString()
}

/** Koniec aktywności; brak lub koniec przed startem → start + 1 h. */
export function buildActivityEndsAt(input: {
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  allDay: boolean
}): string {
  const startsAt = new Date(buildActivityOccurredAt(input))
  const fallback = new Date(startsAt.getTime() + ACTIVITY_DEFAULT_DURATION_MS)
  if (input.allDay || !input.endTime) return fallback.toISOString()
  const endsAt = new Date(`${input.endDate || input.startDate}T${input.endTime}:00`)
  return endsAt > startsAt ? endsAt.toISOString() : fallback.toISOString()
}

export function defaultActivityTitle(
  type: ChannelContactEventType,
  customTitle: string,
): string {
  const trimmed = customTitle.trim()
  if (trimmed) return trimmed
  return activityChannelTypeLabel(type)
}

export type CompanyActivityFormState = {
  title: string
  type: ChannelContactEventType
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  allDay: boolean
  priority: CompanyActivityPriority
  note: string
  responsibleUserId: string | null
  participantUserIds: string[]
  participantContactIds: string[]
}

export function emptyActivityFormState(
  responsibleUserId: string | null = null,
): CompanyActivityFormState {
  const today = todayDateInputValue()
  return {
    title: "",
    type: "activity",
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    allDay: true,
    priority: "neutral",
    note: "",
    responsibleUserId,
    participantUserIds: [],
    participantContactIds: [],
  }
}

/** Zmiana typu aktywności; spotkanie domyślnie 10:00–11:00 zamiast „cały dzień”. */
export function applyActivityType(
  state: CompanyActivityFormState,
  type: ChannelContactEventType,
): CompanyActivityFormState {
  if (type !== "meeting" || !state.allDay) return { ...state, type }
  return { ...state, type, allDay: false, startTime: "10:00", endTime: "11:00" }
}

export function toAddCompanyActivityInput(
  state: CompanyActivityFormState,
  catalogs: {
    users: readonly DemoUser[]
    contacts: readonly CrmContact[]
  },
): AddCompanyActivityInput {
  return {
    title: defaultActivityTitle(state.type, state.title),
    type: state.type,
    occurredAt: buildActivityOccurredAt({
      startDate: state.startDate,
      startTime: state.startTime,
      allDay: state.allDay,
    }),
    endsAt: buildActivityEndsAt(state),
    note: buildActivityNoteBody({
      note: state.note,
      priority: state.priority,
      responsibleUserId: state.responsibleUserId,
      participantUserIds: state.participantUserIds,
      participantContactIds: state.participantContactIds,
      users: catalogs.users,
      contacts: catalogs.contacts,
    }),
    priority: state.priority,
    responsibleUserId: state.responsibleUserId,
    participantUserIds: state.participantUserIds,
    participantContactIds: state.participantContactIds,
  }
}
