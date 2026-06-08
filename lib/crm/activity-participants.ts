import { formatContactName } from "@/lib/crm/contact-display"
import type { CompanyActivityPriority, CrmContact, DemoUser } from "@/types/crm"

export type ActivityParticipantListItem = {
  value: string
  kind: "user" | "contact"
  id: string
  label: string
}

export function userParticipantValue(userId: string) {
  return `user:${userId}`
}

export function contactParticipantValue(contactId: string) {
  return `contact:${contactId}`
}

export function parseParticipantValue(
  value: string,
): { kind: "user" | "contact"; id: string } | null {
  const [kind, id] = value.split(":")
  if ((kind === "user" || kind === "contact") && id) return { kind, id }
  return null
}

export function buildUserParticipantItems(
  users: readonly DemoUser[],
): ActivityParticipantListItem[] {
  return users.map((user) => ({
    value: userParticipantValue(user.id),
    kind: "user",
    id: user.id,
    label: user.displayName,
  }))
}

export function buildContactParticipantItems(
  contacts: readonly CrmContact[],
): ActivityParticipantListItem[] {
  return contacts.map((contact) => ({
    value: contactParticipantValue(contact.id),
    kind: "contact",
    id: contact.id,
    label: formatContactName(contact),
  }))
}

export function splitParticipantValues(values: readonly string[]): {
  participantUserIds: string[]
  participantContactIds: string[]
} {
  const participantUserIds: string[] = []
  const participantContactIds: string[] = []
  for (const value of values) {
    const parsed = parseParticipantValue(value)
    if (!parsed) continue
    if (parsed.kind === "user") participantUserIds.push(parsed.id)
    else participantContactIds.push(parsed.id)
  }
  return { participantUserIds, participantContactIds }
}

export function joinParticipantValues(input: {
  participantUserIds: readonly string[]
  participantContactIds: readonly string[]
}): string[] {
  return [
    ...input.participantUserIds.map(userParticipantValue),
    ...input.participantContactIds.map(contactParticipantValue),
  ]
}

export function buildActivityNoteBody(input: {
  note: string
  priority: CompanyActivityPriority
  responsibleUserId: string | null
  participantUserIds: readonly string[]
  participantContactIds: readonly string[]
  users: readonly DemoUser[]
  contacts: readonly CrmContact[]
}): string {
  const blocks: string[] = []
  const priorityBlock = formatPriorityBlock(input.priority)
  if (priorityBlock) blocks.push(priorityBlock)

  if (input.responsibleUserId) {
    const name = input.users.find((u) => u.id === input.responsibleUserId)
      ?.displayName
    if (name) blocks.push(`Osoba odpowiedzialna: ${name}`)
  }

  const participantNames: string[] = []
  for (const id of input.participantUserIds) {
    const name = input.users.find((u) => u.id === id)?.displayName
    if (name) participantNames.push(name)
  }
  for (const id of input.participantContactIds) {
    const contact = input.contacts.find((c) => c.id === id)
    if (contact) participantNames.push(formatContactName(contact))
  }
  if (participantNames.length > 0) {
    blocks.push(`Uczestnicy: ${participantNames.join(", ")}`)
  }

  const trimmed = input.note.trim()
  if (trimmed) blocks.push(trimmed)

  return blocks.join("\n\n")
}

function formatPriorityBlock(priority: CompanyActivityPriority): string | null {
  if (priority === "neutral") return null
  const labels: Record<Exclude<CompanyActivityPriority, "neutral">, string> = {
    very_high: "Bardzo wysoki",
    high: "Wysoki",
    medium: "Średni",
    low: "Niski",
  }
  return `Priorytet: ${labels[priority]}`
}
