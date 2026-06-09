import type { DealStatus } from "@/types/crm"

export const DEAL_PIPELINE_CATEGORY_IDS = [
  "pcat-credit",
  "pcat-leasing-op",
  "pcat-factoring",
  "pcat-guarantees",
  "pcat-accounts",
  "pcat-deposits",
] as const

export type PipelineCategoryId = (typeof DEAL_PIPELINE_CATEGORY_IDS)[number]

/** Tymczasowy fallback kanban / UI do US-29 (select kategorii). */
export const DEFAULT_PIPELINE_CATEGORY_ID: PipelineCategoryId = "pcat-credit"

const PIPELINE_MIDDLE_STEPS: Record<
  PipelineCategoryId,
  readonly Exclude<DealStatus, "new" | "won" | "lost">[]
> = {
  "pcat-credit": [
    "credit_qualification",
    "credit_analysis",
    "credit_offer",
    "credit_committee",
  ],
  "pcat-leasing-op": [
    "leasing_needs",
    "leasing_offer",
    "leasing_risk",
    "leasing_negotiation",
  ],
  "pcat-factoring": [
    "factoring_buyers",
    "factoring_portfolio",
    "factoring_offer",
    "factoring_signing",
  ],
  "pcat-guarantees": [
    "guarantee_contract",
    "guarantee_pricing",
    "guarantee_approval",
    "guarantee_issuance",
  ],
  "pcat-accounts": [
    "accounts_qualification",
    "accounts_proposal",
    "accounts_onboarding",
    "accounts_activation",
  ],
  "pcat-deposits": [
    "deposit_liquidity",
    "deposit_offer",
    "deposit_acceptance",
    "deposit_opening",
  ],
}

/** Statusy US-18 usunięte z unionu — mapowanie przy migracji seedu (US-28). */
export type LegacyDealStatus =
  | "association_created"
  | "meeting_scheduled"
  | "offer_submitted"
  | "negotiation_started"

const LEGACY_STAGE_TO_US18: Record<string, LegacyDealStatus> = {
  qualification: "association_created",
  offer: "offer_submitted",
  negotiation: "negotiation_started",
}

const LEGACY_US18_POSITION: Record<LegacyDealStatus, number> = {
  association_created: 0,
  meeting_scheduled: 1,
  offer_submitted: 2,
  negotiation_started: 3,
}

export function isPipelineCategoryId(
  value: string,
): value is PipelineCategoryId {
  return (DEAL_PIPELINE_CATEGORY_IDS as readonly string[]).includes(value)
}

export function getPipelineCategoryIds(): PipelineCategoryId[] {
  return [...DEAL_PIPELINE_CATEGORY_IDS]
}

export function getPipelineWorkflowSteps(
  pipelineCategoryId: PipelineCategoryId,
): DealStatus[] {
  return ["new", ...PIPELINE_MIDDLE_STEPS[pipelineCategoryId]]
}

/** Pełna kolejność kolumn kanban (workflow + won + lost). */
export function getPipelineSteps(
  pipelineCategoryId: PipelineCategoryId,
): DealStatus[] {
  return [...getPipelineWorkflowSteps(pipelineCategoryId), "won", "lost"]
}

export function isTerminalDealStatus(status: DealStatus): boolean {
  return status === "won" || status === "lost"
}

export function isDealWorkflowStatus(
  status: DealStatus,
  pipelineCategoryId: PipelineCategoryId,
): boolean {
  return getPipelineWorkflowSteps(pipelineCategoryId).includes(status)
}

export function getDealStepIndex(
  status: DealStatus,
  pipelineCategoryId: PipelineCategoryId,
): number {
  return getPipelineSteps(pipelineCategoryId).indexOf(status)
}

export function resolvePipelineCategoryId(
  productCategoryId: string,
): PipelineCategoryId {
  if (productCategoryId === "pcat-leasing") {
    throw new Error(
      "Kategoria grupowa pcat-leasing nie ma lejka — wybierz kategorię liścia (np. pcat-leasing-op).",
    )
  }
  if (!isPipelineCategoryId(productCategoryId)) {
    throw new Error(
      `Nieznana kategoria lejka: ${productCategoryId}. Oczekiwano jednej z: ${DEAL_PIPELINE_CATEGORY_IDS.join(", ")}`,
    )
  }
  return productCategoryId
}

export function mapLegacyDealStatus(
  pipelineCategoryId: PipelineCategoryId,
  oldStatus: LegacyDealStatus | DealStatus,
): DealStatus {
  if (oldStatus === "new" || oldStatus === "won" || oldStatus === "lost") {
    return oldStatus
  }

  const middle = PIPELINE_MIDDLE_STEPS[pipelineCategoryId]
  const position = LEGACY_US18_POSITION[oldStatus as LegacyDealStatus]
  if (position === undefined) {
    return "new"
  }

  const clampedIndex = Math.min(
    Math.max(position, 0),
    middle.length - 1,
  )
  return middle[clampedIndex]
}

/** Mapuje stary `stage` opportunities.json (lead/qualification/…) na nowy status lejka. */
export function mapLegacyOpportunityStage(
  pipelineCategoryId: PipelineCategoryId,
  stage: string,
): DealStatus {
  if (stage === "lead") return "new"
  if (stage === "won" || stage === "lost") return stage
  const us18 = LEGACY_STAGE_TO_US18[stage]
  if (us18) {
    return mapLegacyDealStatus(pipelineCategoryId, us18)
  }
  return "new"
}

/** Prawdopodobieństwo demo wg indeksu kroku w lejku (§3.4 spec). */
export function dealStepProbability(
  pipelineCategoryId: PipelineCategoryId,
  status: DealStatus,
): number {
  if (status === "won") return 100
  if (status === "lost") return 0

  const workflow = getPipelineWorkflowSteps(pipelineCategoryId)
  const index = workflow.indexOf(status)
  if (index < 0) return 10

  const lastWorkflowIndex = workflow.length - 1
  if (lastWorkflowIndex <= 0) return 10

  const progress = index / lastWorkflowIndex
  return Math.round(10 + progress * 70)
}
