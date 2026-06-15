import { activityChannelTypeLabel } from "@/lib/crm/activity-channel-types"
import { buildActivityNoteBody } from "@/lib/crm/activity-participants"
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
  return new Date().toISOString().slice(0, 10)
}

export function buildActivityOccurredAt(input: {
  startDate: string
  startTime: string
  allDay: boolean
}): string {
  if (!input.startDate) return new Date().toISOString()
  if (input.allDay) return `${input.startDate}T12:00:00.000Z`
  const time = input.startTime || "09:00"
  return `${input.startDate}T${time}:00.000Z`
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
