import type { DealActivity, DealActivityKind, DealActivityType, DemoUser } from "@/types/crm"

export function resolveDealActivityKind(type: DealActivityType): DealActivityKind {
  if (type === "deal_note") return "note"
  if (
    type === "deal_created" ||
    type === "deal_status_changed" ||
    type === "deal_won" ||
    type === "deal_lost"
  ) {
    return "system"
  }
  return "channel"
}

export type DealActivityFilter = "all" | "activities" | "notes" | "files" | "tasks"

export type DealActivityItem = {
  id: string
  occurredAt: string
  title: string
  body: string
  kind: DealActivity["kind"]
  filterTags: DealActivityFilter[]
  authorName?: string
}

function activityFilterTags(activity: DealActivity): DealActivityFilter[] {
  if (activity.kind === "note" || activity.type === "deal_note") return ["all", "notes"]
  if (activity.kind === "channel") return ["all", "activities"]
  return ["all", "activities"]
}

export function buildDealActivityFeed(input: {
  dealId: string
  dealActivities: readonly DealActivity[]
  users: readonly DemoUser[]
}): DealActivityItem[] {
  const byUser = new Map(input.users.map((u) => [u.id, u.displayName]))
  return input.dealActivities
    .filter((a) => a.dealId === input.dealId)
    .map((a) => ({
      id: a.id,
      occurredAt: a.occurredAt,
      title: a.titlePl,
      body: a.note.trim() || a.titlePl,
      kind: a.kind,
      filterTags: activityFilterTags(a),
      authorName: byUser.get(a.responsibleUserId ?? a.ownerId),
    }))
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
}

export function filterDealActivityFeed(
  items: readonly DealActivityItem[],
  filter: DealActivityFilter,
): DealActivityItem[] {
  if (filter === "all") return [...items]
  if (filter === "files" || filter === "tasks") return []
  return items.filter((i) => i.filterTags.includes(filter))
}

