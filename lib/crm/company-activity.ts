import { getContactEventKind } from "@/lib/crm/contact-event-utils"
import { CONTACT_EVENT_TYPE_LABELS } from "@/lib/crm/contact-labels"
import type { ContactEvent, DemoUser, Task } from "@/types/crm"

export type CompanyActivityFilter =
  | "all"
  | "activities"
  | "notes"
  | "files"
  | "tasks"

export type CompanyActivityItem = {
  id: string
  occurredAt: string
  title: string
  body: string
  kind: "system" | "channel" | "note" | "task"
  filterTags: CompanyActivityFilter[]
  authorName?: string
}

function eventTitle(event: ContactEvent): string {
  if (event.titlePl) return event.titlePl
  const kind = getContactEventKind(event)
  if (kind === "note") return "Notatka"
  if (event.type in CONTACT_EVENT_TYPE_LABELS) {
    return CONTACT_EVENT_TYPE_LABELS[
      event.type as keyof typeof CONTACT_EVENT_TYPE_LABELS
    ]
  }
  return "Aktywność"
}

function eventFilterTags(event: ContactEvent): CompanyActivityFilter[] {
  const kind = getContactEventKind(event)
  if (kind === "system" || kind === "channel") {
    return ["all", "activities"]
  }
  if (kind === "note") {
    return ["all", "notes"]
  }
  return ["all"]
}

export function buildCompanyActivityFeed(input: {
  clientId: string
  contactEvents: readonly ContactEvent[]
  tasks: readonly Task[]
  users: readonly DemoUser[]
}): CompanyActivityItem[] {
  const { clientId, contactEvents, tasks, users } = input
  const userNameById = new Map(users.map((u) => [u.id, u.displayName]))

  const fromEvents: CompanyActivityItem[] = contactEvents
    .filter((e) => e.clientId === clientId)
    .map((event) => {
      const title = eventTitle(event)
      const note = event.note.trim()
      const body =
        note ||
        (getContactEventKind(event) === "system"
          ? title
          : "—")
      return {
      id: event.id,
      occurredAt: event.occurredAt,
      title,
      body,
      kind: getContactEventKind(event) as CompanyActivityItem["kind"],
      filterTags: eventFilterTags(event),
      authorName: userNameById.get(event.ownerId),
    }
    })

  const fromTasks: CompanyActivityItem[] = tasks
    .filter((t) => t.clientId === clientId && !t.completed)
    .map((task) => ({
      id: `task-${task.id}`,
      occurredAt: `${task.dueDate}T12:00:00.000Z`,
      title: "Zadanie",
      body: task.title,
      kind: "task" as const,
      filterTags: ["all", "tasks"] as CompanyActivityFilter[],
      authorName: userNameById.get(task.ownerId),
    }))

  return [...fromEvents, ...fromTasks].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
}

export function filterCompanyActivityFeed(
  items: readonly CompanyActivityItem[],
  filter: CompanyActivityFilter,
): CompanyActivityItem[] {
  if (filter === "all") return [...items]
  if (filter === "files") return []
  return items.filter((item) => item.filterTags.includes(filter))
}
