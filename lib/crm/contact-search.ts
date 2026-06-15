import { formatContactName } from "@/lib/crm/contact-display"
import type { CrmContact } from "@/types/crm"

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, "")
}

export function contactMatchesSearch(
  contact: CrmContact,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  const normalizedPhoneQuery = normalizePhone(normalizedQuery)

  const textFields = [
    contact.firstName,
    contact.lastName,
    formatContactName(contact),
    ...contact.emails,
  ].map((value) => value.toLowerCase())

  if (textFields.some((value) => value.includes(normalizedQuery))) {
    return true
  }

  return contact.phones.some((phone) => {
    const normalizedPhone = normalizePhone(phone).toLowerCase()
    return (
      normalizedPhone.includes(normalizedPhoneQuery) ||
      phone.toLowerCase().includes(normalizedQuery)
    )
  })
}

export function filterContactsBySearch<T extends { contact: CrmContact }>(
  rows: T[],
  query: string,
): T[] {
  const normalized = query.trim()
  if (!normalized) return rows
  return rows.filter((row) => contactMatchesSearch(row.contact, normalized))
}
