import type { ChannelContactEventType, ContactEventType } from "@/types/crm"

export const CONTACT_EVENT_TYPE_LABELS: Record<
  ChannelContactEventType,
  string
> = {
  activity: "Aktywność",
  phone: "Połączenie",
  meeting: "Spotkanie",
  chat: "Czat",
  email: "E-mail",
}

export const CONTACT_EVENT_EXTENDED_LABELS: Partial<
  Record<ContactEventType, string>
> = {
  ...CONTACT_EVENT_TYPE_LABELS,
  company_created: "Utworzono firmę",
  note: "Notatka",
}
