import { LEAD_STATUS_LABELS } from "@/lib/crm/lead-labels"
import type {
  DemoUser,
  LeadActivity,
  LeadActivityKind,
  LeadActivityType,
  LeadStatus,
} from "@/types/crm"

export function resolveLeadActivityKind(
  type: LeadActivityType,
): LeadActivityKind {
  if (type === "lead_note") return "note"
  if (
    type === "lead_created" ||
    type === "lead_status_changed" ||
    type === "lead_won" ||
    type === "lead_lost"
  ) {
    return "system"
  }
  return "channel"
}

export type LeadActivityFilter =
  | "all"
  | "activities"
  | "notes"
  | "files"
  | "tasks"

export type LeadActivityItem = {
  id: string
  occurredAt: string
  title: string
  body: string
  kind: LeadActivity["kind"]
  filterTags: LeadActivityFilter[]
  authorName?: string
}

function activityFilterTags(
  activity: LeadActivity,
): LeadActivityFilter[] {
  if (activity.kind === "note" || activity.type === "lead_note") {
    return ["all", "notes"]
  }
  if (activity.kind === "channel") {
    return ["all", "activities"]
  }
  return ["all", "activities"]
}

function activityAuthorId(activity: LeadActivity): string {
  return activity.responsibleUserId ?? activity.ownerId
}

export function buildLeadActivityFeed(input: {
  leadId: string
  leadActivities: readonly LeadActivity[]
  users: readonly DemoUser[]
}): LeadActivityItem[] {
  const userNameById = new Map(input.users.map((u) => [u.id, u.displayName]))

  return input.leadActivities
    .filter((a) => a.leadId === input.leadId)
    .map((activity) => ({
      id: activity.id,
      occurredAt: activity.occurredAt,
      title: activity.titlePl,
      body: activity.note.trim() || activity.titlePl,
      kind: activity.kind,
      filterTags: activityFilterTags(activity),
      authorName: userNameById.get(activityAuthorId(activity)),
    }))
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
}

export function filterLeadActivityFeed(
  items: readonly LeadActivityItem[],
  filter: LeadActivityFilter,
): LeadActivityItem[] {
  if (filter === "all") return [...items]
  if (filter === "files" || filter === "tasks") return []
  return items.filter((item) => item.filterTags.includes(filter))
}

export function leadStatusChangeNote(
  from: LeadStatus,
  to: LeadStatus,
): string {
  return `${LEAD_STATUS_LABELS[from]} → ${LEAD_STATUS_LABELS[to]}`
}
