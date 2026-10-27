import type { ChannelContactEventType } from "@/types/crm"

/** Typy kanału w formularzu nowej aktywności; e-mail tylko jako rejestracja ręczna (QW-18). */
export type ActivityChannelType = ChannelContactEventType

export type ActivityChannelTypeOption = {
  id: ActivityChannelType
  label: string
}

export const ACTIVITY_CHANNEL_TYPE_OPTIONS: ActivityChannelTypeOption[] = [
  { id: "activity", label: "Aktywność" },
  { id: "phone", label: "Połączenie" },
  { id: "meeting", label: "Spotkanie" },
  { id: "video_call", label: "Wideokonferencja" },
  { id: "email", label: "E-mail (rejestracja ręczna)" },
]

export function activityChannelTypeLabel(type: ChannelContactEventType): string {
  if (type === "email") return "E-mail"
  return (
    ACTIVITY_CHANNEL_TYPE_OPTIONS.find((o) => o.id === type)?.label ??
    "Aktywność"
  )
}
