import type {
  DealActivity,
  DealActivityKind,
  DealActivityType,
  DealDocument,
  DemoUser,
  Task,
} from "@/types/crm"

export function resolveDealActivityKind(
  type: DealActivityType,
): DealActivityKind {
  if (type === "deal_note") return "note"
  if (
    type === "deal_created" ||
    type === "deal_status_changed" ||
    type === "deal_won" ||
    type === "deal_lost" ||
    type === "deal_document_added" ||
    type === "deal_task_created" ||
    type === "deal_task_completed"
  ) {
    return "system"
  }
  return "channel"
}

export type DealActivityFilter =
  | "all"
  | "activities"
  | "notes"
  | "files"
  | "tasks"

export type DealActivityItem = {
  id: string
  occurredAt: string
  title: string
  body: string
  kind: DealActivity["kind"]
  filterTags: DealActivityFilter[]
  authorId?: string
  authorName?: string
}

function activityFilterTags(
  activity: DealActivity,
): DealActivityFilter[] {
  if (activity.kind === "note" || activity.type === "deal_note") {
    return ["all", "notes"]
  }
  if (activity.type === "deal_document_added") {
    return ["all", "files"]
  }
  if (
    activity.type === "deal_task_created" ||
    activity.type === "deal_task_completed"
  ) {
    return ["all", "tasks"]
  }
  if (activity.kind === "channel") {
    return ["all", "activities"]
  }
  return ["all", "activities"]
}

function activityAuthorId(activity: DealActivity): string {
  return activity.responsibleUserId ?? activity.ownerId
}

function clampAfterDealCreation(
  occurredAt: string,
  dealCreatedAt: string,
  minOffsetMs = 60 * 60 * 1000,
): string {
  const min = new Date(dealCreatedAt).getTime() + minOffsetMs
  const value = new Date(occurredAt).getTime()
  return new Date(Math.max(value, min)).toISOString()
}

function taskCreatedOccurredAt(dueDate: string, dealCreatedAt: string): string {
  const due = new Date(`${dueDate}T12:00:00.000Z`)
  due.setUTCDate(due.getUTCDate() - 2)
  return clampAfterDealCreation(due.toISOString(), dealCreatedAt, 2 * 60 * 60 * 1000)
}

function taskCompletedOccurredAt(
  dueDate: string,
  dealCreatedAt: string,
): string {
  return clampAfterDealCreation(
    `${dueDate}T16:00:00.000Z`,
    dealCreatedAt,
    2 * 60 * 60 * 1000,
  )
}

function hasTaskCompletionActivity(
  activities: readonly DealActivity[],
  dealId: string,
  taskTitle: string,
): boolean {
  return activities.some(
    (activity) =>
      activity.dealId === dealId &&
      activity.type === "deal_task_completed" &&
      activity.note === taskTitle,
  )
}

function documentFeedItems(
  dealId: string,
  dealCreatedAt: string,
  dealDocuments: readonly DealDocument[],
  userNameById: Map<string, string>,
): DealActivityItem[] {
  return dealDocuments
    .filter((doc) => doc.dealId === dealId)
    .map((doc) => ({
      id: `deal-feed-doc-${doc.id}`,
      occurredAt: clampAfterDealCreation(
        doc.uploadedAt,
        dealCreatedAt,
        24 * 60 * 60 * 1000,
      ),
      title: "Dodano dokument",
      body: doc.name,
      kind: "system" as const,
      filterTags: ["all", "files"] as DealActivityFilter[],
      authorId: doc.ownerId,
      authorName: userNameById.get(doc.ownerId),
    }))
}

function taskFeedItems(
  dealId: string,
  dealCreatedAt: string,
  tasks: readonly Task[],
  dealActivities: readonly DealActivity[],
  userNameById: Map<string, string>,
): DealActivityItem[] {
  const items: DealActivityItem[] = []

  for (const task of tasks) {
    if (task.opportunityId !== dealId) continue

    if (!task.completed) {
      items.push({
        id: `deal-feed-task-${task.id}`,
        occurredAt: taskCreatedOccurredAt(task.dueDate, dealCreatedAt),
        title: "Utworzono zadanie",
        body: task.title,
        kind: "system",
        filterTags: ["all", "tasks"],
        authorId: task.ownerId,
        authorName: userNameById.get(task.ownerId),
      })
      continue
    }

    if (hasTaskCompletionActivity(dealActivities, dealId, task.title)) {
      continue
    }

    items.push({
      id: `deal-feed-task-done-${task.id}`,
      occurredAt: taskCompletedOccurredAt(task.dueDate, dealCreatedAt),
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

export function buildDealActivityFeed(input: {
  dealId: string
  dealCreatedAt: string
  dealActivities: readonly DealActivity[]
  dealDocuments: readonly DealDocument[]
  tasks: readonly Task[]
  users: readonly DemoUser[]
}): DealActivityItem[] {
  const userNameById = new Map(input.users.map((u) => [u.id, u.displayName]))

  const activityItems = input.dealActivities
    .filter((a) => a.dealId === input.dealId)
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
    input.dealId,
    input.dealCreatedAt,
    input.dealDocuments,
    userNameById,
  )

  const taskItems = taskFeedItems(
    input.dealId,
    input.dealCreatedAt,
    input.tasks,
    input.dealActivities,
    userNameById,
  )

  return [...activityItems, ...documentItems, ...taskItems].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
}

export function filterDealActivityFeed(
  items: readonly DealActivityItem[],
  filter: DealActivityFilter,
): DealActivityItem[] {
  if (filter === "all") return [...items]
  return items.filter((item) => item.filterTags.includes(filter))
}
