import { LEAD_STATUS_LABELS } from "@/lib/crm/lead-labels"
import type {
  DemoUser,
  LeadActivity,
  LeadActivityKind,
  LeadActivityType,
  LeadDocument,
  LeadStatus,
  Task,
} from "@/types/crm"

export function resolveLeadActivityKind(
  type: LeadActivityType,
): LeadActivityKind {
  if (type === "lead_note") return "note"
  if (
    type === "lead_created" ||
    type === "lead_status_changed" ||
    type === "lead_won" ||
    type === "lead_lost" ||
    type === "lead_document_added" ||
    type === "lead_task_created" ||
    type === "lead_task_completed"
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
  authorId?: string
  authorName?: string
}

function activityFilterTags(
  activity: LeadActivity,
): LeadActivityFilter[] {
  if (activity.kind === "note" || activity.type === "lead_note") {
    return ["all", "notes"]
  }
  if (activity.type === "lead_document_added") {
    return ["all", "files"]
  }
  if (
    activity.type === "lead_task_created" ||
    activity.type === "lead_task_completed"
  ) {
    return ["all", "tasks"]
  }
  if (activity.kind === "channel") {
    return ["all", "activities"]
  }
  return ["all", "activities"]
}

function activityAuthorId(activity: LeadActivity): string {
  return activity.responsibleUserId ?? activity.ownerId
}

function clampAfterLeadCreation(
  occurredAt: string,
  leadCreatedAt: string,
  minOffsetMs = 60 * 60 * 1000,
): string {
  const min = new Date(leadCreatedAt).getTime() + minOffsetMs
  const value = new Date(occurredAt).getTime()
  return new Date(Math.max(value, min)).toISOString()
}

function taskCreatedOccurredAt(dueDate: string, leadCreatedAt: string): string {
  const due = new Date(`${dueDate}T12:00:00.000Z`)
  due.setUTCDate(due.getUTCDate() - 2)
  return clampAfterLeadCreation(due.toISOString(), leadCreatedAt, 2 * 60 * 60 * 1000)
}

function taskCompletedOccurredAt(
  dueDate: string,
  leadCreatedAt: string,
): string {
  return clampAfterLeadCreation(
    `${dueDate}T16:00:00.000Z`,
    leadCreatedAt,
    2 * 60 * 60 * 1000,
  )
}

function hasTaskCompletionActivity(
  activities: readonly LeadActivity[],
  leadId: string,
  taskTitle: string,
): boolean {
  return activities.some(
    (activity) =>
      activity.leadId === leadId &&
      activity.type === "lead_task_completed" &&
      activity.note === taskTitle,
  )
}

function documentFeedItems(
  leadId: string,
  leadCreatedAt: string,
  leadDocuments: readonly LeadDocument[],
  userNameById: Map<string, string>,
): LeadActivityItem[] {
  return leadDocuments
    .filter((doc) => doc.leadId === leadId)
    .map((doc) => ({
      id: `lead-feed-doc-${doc.id}`,
      occurredAt: clampAfterLeadCreation(doc.uploadedAt, leadCreatedAt, 24 * 60 * 60 * 1000),
      title: "Dodano dokument",
      body: doc.name,
      kind: "system" as const,
      filterTags: ["all", "files"] as LeadActivityFilter[],
      authorId: doc.ownerId,
      authorName: userNameById.get(doc.ownerId),
    }))
}

function taskFeedItems(
  leadId: string,
  leadCreatedAt: string,
  tasks: readonly Task[],
  leadActivities: readonly LeadActivity[],
  userNameById: Map<string, string>,
): LeadActivityItem[] {
  const items: LeadActivityItem[] = []

  for (const task of tasks) {
    if (task.leadId !== leadId) continue

    if (!task.completed) {
      items.push({
        id: `lead-feed-task-${task.id}`,
        occurredAt: taskCreatedOccurredAt(task.dueDate, leadCreatedAt),
        title: "Utworzono zadanie",
        body: task.title,
        kind: "system",
        filterTags: ["all", "tasks"],
        authorId: task.ownerId,
        authorName: userNameById.get(task.ownerId),
      })
      continue
    }

    if (hasTaskCompletionActivity(leadActivities, leadId, task.title)) {
      continue
    }

    items.push({
      id: `lead-feed-task-done-${task.id}`,
      occurredAt: taskCompletedOccurredAt(task.dueDate, leadCreatedAt),
      title: "Zadanie wykonane",
      body: task.title,
      kind: "system",
      filterTags: ["all", "tasks"],
      authorId: task.ownerId,
      authorName: userNameById.get(task.ownerId),
    })
  }

  return items
}

export function buildLeadActivityFeed(input: {
  leadId: string
  leadCreatedAt: string
  leadActivities: readonly LeadActivity[]
  leadDocuments: readonly LeadDocument[]
  tasks: readonly Task[]
  users: readonly DemoUser[]
}): LeadActivityItem[] {
  const userNameById = new Map(input.users.map((u) => [u.id, u.displayName]))

  const activityItems = input.leadActivities
    .filter((a) => a.leadId === input.leadId)
    .map((activity) => ({
      id: activity.id,
      occurredAt: activity.occurredAt,
      title: activity.titlePl,
      body: activity.note.trim() || activity.titlePl,
      kind: activity.kind,
      filterTags: activityFilterTags(activity),
      authorId: activityAuthorId(activity),
      authorName: userNameById.get(activityAuthorId(activity)),
    }))

  const documentItems = documentFeedItems(
    input.leadId,
    input.leadCreatedAt,
    input.leadDocuments,
    userNameById,
  )

  const taskItems = taskFeedItems(
    input.leadId,
    input.leadCreatedAt,
    input.tasks,
    input.leadActivities,
    userNameById,
  )

  return [...activityItems, ...documentItems, ...taskItems].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
}

export function filterLeadActivityFeed(
  items: readonly LeadActivityItem[],
  filter: LeadActivityFilter,
): LeadActivityItem[] {
  if (filter === "all") return [...items]
  return items.filter((item) => item.filterTags.includes(filter))
}

export function leadStatusChangeNote(
  from: LeadStatus,
  to: LeadStatus,
): string {
  return `${LEAD_STATUS_LABELS[from]} → ${LEAD_STATUS_LABELS[to]}`
}
