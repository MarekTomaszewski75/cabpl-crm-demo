import type { ContactEvent, ContactEventKind } from "@/types/crm"

export function getContactEventKind(event: ContactEvent): ContactEventKind {
  if (event.kind) return event.kind
  if (event.type === "company_created") return "system"
  if (event.type === "note") return "note"
  return "channel"
}

export function isChannelContactEvent(event: ContactEvent): boolean {
  return getContactEventKind(event) === "channel"
}
