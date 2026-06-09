import type {
  DealCurrency,
  DealLostReason,
  DealSource,
  DealStatus,
  DealType,
} from "@/types/crm"

export const DEAL_WORKFLOW_STATUSES: readonly DealStatus[] = [
  "new",
  "association_created",
  "meeting_scheduled",
  "offer_submitted",
  "negotiation_started",
] as const

export const DEAL_STATUS_OPTIONS: DealStatus[] = [
  ...DEAL_WORKFLOW_STATUSES,
  "won",
  "lost",
]

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  new: "Nowy",
  association_created: "Powiązanie utworzone",
  meeting_scheduled: "Spotkanie zaplanowane",
  offer_submitted: "Oferta złożona",
  negotiation_started: "Rozpoczęto negocjacje",
  won: "Wygrany",
  lost: "Utracony",
}

export const DEAL_CURRENCY_LABELS: Record<DealCurrency, string> = {
  PLN: "PLN",
  EUR: "EUR",
  USD: "USD",
  CHF: "CHF",
  GBP: "GBP",
}

export const DEAL_SOURCE_LABELS: Record<DealSource, string> = {
  phone_call: "Połączenie",
  link: "Link",
  email: "E-mail",
  advertising: "Reklama",
  partner: "Partner",
  recommendation: "Z rekomendacji",
}

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  unknown: "Nieznany",
  active_client: "Aktywny klient",
  hot: "Gorący deal",
  warm: "Ciepły deal",
  cold: "Zimny deal",
}

export const DEAL_LOST_REASON_LABELS: Record<DealLostReason, string> = {
  refusal: "Odmowa",
  outdated: "Nieaktualne",
  communication_broken: "Komunikacja przerwana",
  too_expensive: "Drogo",
  competitor_chosen: "Wybrano konkurencję",
  other: "Inne",
}

export const DEAL_CURRENCY_OPTIONS = (
  Object.entries(DEAL_CURRENCY_LABELS) as [DealCurrency, string][]
).map(([value, label]) => ({ value, label }))

export const DEAL_SOURCE_OPTIONS = (
  Object.entries(DEAL_SOURCE_LABELS) as [DealSource, string][]
).map(([value, label]) => ({ value, label }))

export const DEAL_TYPE_OPTIONS = (
  Object.entries(DEAL_TYPE_LABELS) as [DealType, string][]
).map(([value, label]) => ({ value, label }))

export const DEAL_LOST_REASON_OPTIONS = (
  Object.entries(DEAL_LOST_REASON_LABELS) as [DealLostReason, string][]
).map(([value, label]) => ({ value, label }))

export function dealStatusBadgeVariant(
  status: DealStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "new":
    case "association_created":
    case "meeting_scheduled":
    case "offer_submitted":
    case "negotiation_started":
      return "secondary"
    case "won":
      return "outline"
    case "lost":
      return "destructive"
  }
}

export function dealStatusIndicatorVariant(
  status: DealStatus,
): "default" | "success" | "error" | "warning" | "info" {
  switch (status) {
    case "new":
    case "association_created":
    case "meeting_scheduled":
      return "info"
    case "offer_submitted":
    case "negotiation_started":
      return "warning"
    case "won":
      return "success"
    case "lost":
      return "error"
  }
}

export function canFinishDeal(status: DealStatus): boolean {
  return DEAL_WORKFLOW_STATUSES.includes(status)
}

export function isTerminalDealStatus(status: DealStatus): boolean {
  return status === "won" || status === "lost"
}

