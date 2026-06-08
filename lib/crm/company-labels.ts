import type { CompanySource, CompanyType } from "@/types/crm"

export const COMPANY_SOURCE_LABELS: Record<CompanySource, string> = {
  phone_call: "Połączenie",
  link: "Link",
  email: "Email",
  partner: "Partner",
  recommendation: "Z rekomendacji",
}

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  unknown: "Nieznany",
  active_client: "Aktywny klient",
  potential_client: "Potencjalny klient",
  former_client: "Były klient",
  partner: "Partner",
  contractor: "Wykonawca",
  competitor: "Konkurent",
  spam: "Spam",
}

export const COMPANY_SOURCE_OPTIONS = (
  Object.entries(COMPANY_SOURCE_LABELS) as [CompanySource, string][]
).map(([value, label]) => ({ value, label }))

export const COMPANY_TYPE_OPTIONS = (
  Object.entries(COMPANY_TYPE_LABELS) as [CompanyType, string][]
).map(([value, label]) => ({ value, label }))
