import {
  getPipelineCategoryIds,
  getPipelineSteps,
  isPipelineCategoryId,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import type { DealStatus } from "@/types/crm"

export const DEAL_PIPELINE_CATEGORY_LABELS: Record<PipelineCategoryId, string> =
  {
    "pcat-credit": "Kredyty korporacyjne",
    "pcat-leasing-op": "Leasing",
    "pcat-factoring": "Faktoring",
    "pcat-guarantees": "Gwarancje i akredytywy",
    "pcat-accounts": "Rachunki i płatności",
    "pcat-deposits": "Depozyty",
  }

const COMMON_STATUS_LABELS: Record<"new" | "won" | "lost", string> = {
  new: "Nowy",
  won: "Wygrany",
  lost: "Utracony",
}

const MIDDLE_STATUS_LABELS: Record<
  Exclude<DealStatus, "new" | "won" | "lost">,
  string
> = {
  credit_qualification: "Kwalifikacja klienta",
  credit_analysis: "Analiza kredytowa",
  credit_offer: "Oferta warunków",
  credit_committee: "Komitet kredytowy",
  leasing_needs: "Identyfikacja potrzeb",
  leasing_offer: "Oferta leasingowa",
  leasing_risk: "Analiza ryzyka",
  leasing_negotiation: "Negocjacje warunków",
  factoring_buyers: "Weryfikacja nabywców",
  factoring_portfolio: "Ocena portfela wierzytelności",
  factoring_offer: "Oferta faktoringowa",
  factoring_signing: "Podpisanie umowy",
  guarantee_contract: "Analiza kontraktu",
  guarantee_pricing: "Wycena ryzyka i prowizji",
  guarantee_approval: "Zatwierdzenie gwarancji",
  guarantee_issuance: "Wydanie instrumentu",
  accounts_qualification: "Kwalifikacja potrzeb",
  accounts_proposal: "Propozycja pakietu",
  accounts_onboarding: "Onboarding",
  accounts_activation: "Aktywacja produktów",
  deposit_liquidity: "Analiza płynności",
  deposit_offer: "Oferta warunków depozytowych",
  deposit_acceptance: "Akceptacja klienta",
  deposit_opening: "Założenie depozytu",
}

const ALL_DEAL_STATUSES: DealStatus[] = [
  "new",
  ...Object.keys(MIDDLE_STATUS_LABELS),
  "won",
  "lost",
] as DealStatus[]

export function getDealStatusLabel(
  status: DealStatus,
  _pipelineCategoryId?: PipelineCategoryId,
): string {
  if (status === "new" || status === "won" || status === "lost") {
    return COMMON_STATUS_LABELS[status]
  }
  return MIDDLE_STATUS_LABELS[status]
}

export function getAllDealStatusFilterOptions(): {
  value: DealStatus
  label: string
  pipelineCategoryId: PipelineCategoryId
}[] {
  const options: {
    value: DealStatus
    label: string
    pipelineCategoryId: PipelineCategoryId
  }[] = []

  for (const categoryId of getPipelineCategoryIds()) {
    const categoryLabel = DEAL_PIPELINE_CATEGORY_LABELS[categoryId]
    for (const status of getPipelineSteps(categoryId)) {
      const statusLabel = getDealStatusLabel(status, categoryId)
      options.push({
        value: status,
        label: `${categoryLabel}: ${statusLabel}`,
        pipelineCategoryId: categoryId,
      })
    }
  }

  return options
}

/** Płaska mapa etykiet — kompatybilność wsteczna z US-18. */
export const DEAL_STATUS_LABELS: Record<DealStatus, string> = Object.fromEntries(
  ALL_DEAL_STATUSES.map((status) => [status, getDealStatusLabel(status)]),
) as Record<DealStatus, string>

export function getPipelineCategoryLabel(categoryId: string): string {
  if (isPipelineCategoryId(categoryId)) {
    return DEAL_PIPELINE_CATEGORY_LABELS[categoryId]
  }
  return categoryId
}
