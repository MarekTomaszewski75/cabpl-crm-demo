import type { CompanySource, CompanyType } from "@/types/crm"

export const COMPANY_SOURCE_LABELS: Record<CompanySource, string> = {
  rm_initiative: "Inicjatywa opiekuna",
  client_request: "Zapytanie klienta",
  client_referral: "Rekomendacja klienta",
  ca_group: "Grupa Crédit Agricole",
  partner: "Partner / pośrednik",
  industry_event: "Wydarzenie branżowe",
}

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  unknown: "Nieokreślony",
  active_client: "Aktywny klient",
  potential_client: "Prospekt",
  former_client: "Były klient",
}

export const COMPANY_SOURCE_OPTIONS = (
  Object.entries(COMPANY_SOURCE_LABELS) as [CompanySource, string][]
).map(([value, label]) => ({ value, label }))

export const COMPANY_TYPE_OPTIONS = (
  Object.entries(COMPANY_TYPE_LABELS) as [CompanyType, string][]
).map(([value, label]) => ({ value, label }))
