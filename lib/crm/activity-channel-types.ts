import type { ChannelContactEventType } from "@/types/crm"

/** Typy kanału dostępne w formularzu nowej aktywności (bez E-mail). */
export type ActivityChannelType = Exclude<ChannelContactEventType, "email">

export type ActivityChannelTypeOption = {
  id: ActivityChannelType
  label: string
}

export const ACTIVITY_CHANNEL_TYPE_OPTIONS: ActivityChannelTypeOption[] = [
  { id: "activity", label: "Aktywność" },
  { id: "phone", label: "Połączenie" },
  { id: "meeting", label: "Spotkanie" },
  { id: "chat", label: "Czat" },
]

export function activityChannelTypeLabel(type: ChannelContactEventType): string {
  if (type === "email") return "E-mail"
  return (
    ACTIVITY_CHANNEL_TYPE_OPTIONS.find((o) => o.id === type)?.label ??
    "Aktywność"
  )
}
