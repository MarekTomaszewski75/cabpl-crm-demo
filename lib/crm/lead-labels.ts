import type {
  LeadLostReason,
  LeadSource,
  LeadStatus,
  LeadType,
} from "@/types/crm"

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "in_progress",
  "won",
  "lost",
]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nowy",
  in_progress: "W toku",
  won: "Wygrany",
  lost: "Utracony",
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  rm_initiative: "Inicjatywa opiekuna",
  client_request: "Zapytanie klienta",
  client_referral: "Rekomendacja klienta",
  ca_group: "Grupa Crédit Agricole",
  partner: "Partner / pośrednik",
  industry_event: "Wydarzenie branżowe",
}

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  unknown: "Nieznany",
  active_client: "Aktywny klient",
  hot: "Gorący lead",
  warm: "Ciepły lead",
  cold: "Zimny lead",
}

export const LEAD_LOST_REASON_LABELS: Record<LeadLostReason, string> = {
  misrouted: "Błędnie przypisany lead",
  invalid_contact: "Nieprawidłowe dane kontaktowe",
  no_response_3d: "Brak odpowiedzi klienta",
  competitor_chosen: "Wybór oferty innego banku",
  other: "Inny powód",
}

export function leadSourceLabel(
  source: LeadSource,
  dictionary?: readonly { id: LeadSource; labelPl: string }[],
): string {
  return (
    dictionary?.find((item) => item.id === source)?.labelPl ??
    LEAD_SOURCE_LABELS[source]
  )
}

export const LEAD_SOURCE_OPTIONS = (
  Object.entries(LEAD_SOURCE_LABELS) as [LeadSource, string][]
).map(([value, label]) => ({ value, label }))

export const LEAD_TYPE_OPTIONS = (
  Object.entries(LEAD_TYPE_LABELS) as [LeadType, string][]
).map(([value, label]) => ({ value, label }))

export const LEAD_LOST_REASON_OPTIONS = (
  Object.entries(LEAD_LOST_REASON_LABELS) as [LeadLostReason, string][]
).map(([value, label]) => ({ value, label }))

export function leadStatusBadgeVariant(
  status: LeadStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "new":
      return "default"
    case "in_progress":
      return "secondary"
    case "won":
      return "outline"
    case "lost":
      return "destructive"
  }
}

export function leadStatusIndicatorVariant(
  status: LeadStatus,
): "default" | "success" | "error" | "warning" | "info" {
  switch (status) {
    case "new":
      return "info"
    case "in_progress":
      return "warning"
    case "won":
      return "success"
    case "lost":
      return "error"
  }
}

export function canFinishLead(status: LeadStatus): boolean {
  return status === "new" || status === "in_progress"
}

export function isTerminalLeadStatus(status: LeadStatus): boolean {
  return status === "won" || status === "lost"
}
