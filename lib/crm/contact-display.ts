import type { CrmContact } from "@/types/crm"

export function formatContactName(contact: CrmContact): string {
  return `${contact.firstName} ${contact.lastName}`.trim()
}

export function formatContactOptionLabel(contact: CrmContact): string {
  const name = formatContactName(contact)
  const email = contact.emails[0]?.trim()
  const phone = contact.phones[0]?.trim()
  const extras = [email, phone].filter(Boolean)
  return extras.length > 0 ? `${name} · ${extras.join(" · ")}` : name
}
