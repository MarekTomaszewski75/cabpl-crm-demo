import { getContactEventKind } from "@/lib/crm/contact-event-utils"
import { CONTACT_EVENT_EXTENDED_LABELS } from "@/lib/crm/contact-labels"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  ContactEvent,
  Deal,
  DealActivity,
  DemoUser,
  Lead,
  LeadActivity,
} from "@/types/crm"

export type TeamActivityEntityType = "client" | "lead" | "deal"

export type TeamActivityRow = {
  id: string
  occurredAt: string
  title: string
  note: string
  kind: "channel" | "note"
  entityType: TeamActivityEntityType
  entityId: string
  entityName: string
  ownerId: string
  ownerName: string
  detailHref: string
  _filter: string
}

export const TEAM_ACTIVITY_ENTITY_LABELS: Record<
  TeamActivityEntityType,
  string
> = {
  client: "Firma",
  lead: "Lead",
  deal: "Deal",
}

function contactEventTitle(event: ContactEvent): string {
  if (event.titlePl) return event.titlePl
  const kind = getContactEventKind(event)
  if (kind === "note") return "Notatka"
  if (event.type in CONTACT_EVENT_EXTENDED_LABELS) {
    return CONTACT_EVENT_EXTENDED_LABELS[
      event.type as keyof typeof CONTACT_EVENT_EXTENDED_LABELS
    ]!
  }
  return "Aktywność"
}

function activityAuthorId(activity: LeadActivity | DealActivity): string {
  return activity.responsibleUserId ?? activity.ownerId
}

function buildFilterText(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase()
}

export function buildTeamActivityRows(input: {
  user: DemoUser
  users: readonly DemoUser[]
  contactEvents: readonly ContactEvent[]
  leadActivities: readonly LeadActivity[]
  dealActivities: readonly DealActivity[]
  clients: readonly Client[]
  leads: readonly Lead[]
  deals: readonly Deal[]
}): TeamActivityRow[] {
  const ownerNameById = new Map(input.users.map((u) => [u.id, u.displayName]))
  const clientNameById = new Map(
    filterByScope(input.clients, input.user).map((c) => [c.id, c.name]),
  )
  const leadNameById = new Map(
    filterByScope(input.leads, input.user).map((l) => [l.id, l.name]),
  )
  const dealNameById = new Map(
    filterByScope(input.deals, input.user).map((d) => [d.id, d.name]),
  )

  const rows: TeamActivityRow[] = []

  for (const event of filterByScope(input.contactEvents, input.user)) {
    const kind = getContactEventKind(event)
    if (kind !== "channel" && kind !== "note") continue
    const entityName = clientNameById.get(event.clientId)
    if (!entityName) continue
    const title = contactEventTitle(event)
    const note = event.note.trim()
    const ownerName = ownerNameById.get(event.ownerId) ?? event.ownerId
    rows.push({
      id: event.id,
      occurredAt: event.occurredAt,
      title,
      note,
      kind,
      entityType: "client",
      entityId: event.clientId,
      entityName,
      ownerId: event.ownerId,
      ownerName,
      detailHref: `/clients/${event.clientId}?activityId=${event.id}`,
      _filter: buildFilterText([
        title,
        note,
        entityName,
        ownerName,
        TEAM_ACTIVITY_ENTITY_LABELS.client,
      ]),
    })
  }

  for (const activity of filterByScope(input.leadActivities, input.user)) {
    if (activity.kind !== "channel" && activity.kind !== "note") continue
    const entityName = leadNameById.get(activity.leadId)
    if (!entityName) continue
    const ownerId = activityAuthorId(activity)
    const ownerName = ownerNameById.get(ownerId) ?? ownerId
    const title = activity.titlePl
    const note = activity.note.trim()
    rows.push({
      id: activity.id,
      occurredAt: activity.occurredAt,
      title,
      note,
      kind: activity.kind,
      entityType: "lead",
      entityId: activity.leadId,
      entityName,
      ownerId,
      ownerName,
      detailHref: `/leads/${activity.leadId}?activityId=${activity.id}`,
      _filter: buildFilterText([
        title,
        note,
        entityName,
        ownerName,
        TEAM_ACTIVITY_ENTITY_LABELS.lead,
      ]),
    })
  }

  for (const activity of filterByScope(input.dealActivities, input.user)) {
    if (activity.kind !== "channel" && activity.kind !== "note") continue
    const entityName = dealNameById.get(activity.dealId)
    if (!entityName) continue
    const ownerId = activityAuthorId(activity)
    const ownerName = ownerNameById.get(ownerId) ?? ownerId
    const title = activity.titlePl
    const note = activity.note.trim()
    rows.push({
      id: activity.id,
      occurredAt: activity.occurredAt,
      title,
      note,
      kind: activity.kind,
      entityType: "deal",
      entityId: activity.dealId,
      entityName,
      ownerId,
      ownerName,
      detailHref: `/pipeline/${activity.dealId}?activityId=${activity.id}`,
      _filter: buildFilterText([
        title,
        note,
        entityName,
        ownerName,
        TEAM_ACTIVITY_ENTITY_LABELS.deal,
      ]),
    })
  }

  return rows.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
}

export function getRegionTeamMemberIds(
  user: DemoUser,
  users: readonly DemoUser[],
): string[] {
  if (user.role !== "regional_manager" || !user.regionId) {
    return []
  }
  return users
    .filter(
      (member) =>
        member.regionId === user.regionId &&
        (member.role === "advisor" || member.role === "regional_manager"),
    )
    .map((member) => member.id)
}
