import {
  getDealStepIndex,
  getPipelineWorkflowSteps,
  isDealWorkflowStatus,
  isPipelineCategoryId,
  isTerminalDealStatus,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import {
  DEAL_STATUS_LABELS,
  getDealStatusLabel,
} from "@/lib/crm/deal-pipeline-labels"
import type {
  DealCurrency,
  DealLostReason,
  DealSource,
  DealStatus,
  DealType,
} from "@/types/crm"

export { DEAL_STATUS_LABELS, getDealStatusLabel }

export const DEAL_STATUS_OPTIONS: DealStatus[] = [
  "new",
  "won",
  "lost",
  ...(
    Object.keys(DEAL_STATUS_LABELS) as DealStatus[]
  ).filter((status) => status !== "new" && status !== "won" && status !== "lost"),
]

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

function resolveCategory(
  pipelineCategoryId?: string,
): PipelineCategoryId | undefined {
  if (pipelineCategoryId && isPipelineCategoryId(pipelineCategoryId)) {
    return pipelineCategoryId
  }
  return undefined
}

function workflowStepRole(
  stepIndex: number,
  workflowLength: number,
): "lead" | "qualification" | "offer" | "negotiation" {
  if (stepIndex <= 0) return "lead"
  if (stepIndex >= workflowLength - 1) return "negotiation"
  if (stepIndex <= Math.ceil((workflowLength - 1) / 2)) return "qualification"
  return "offer"
}

export function dealStatusBadgeVariant(
  status: DealStatus,
  pipelineCategoryId?: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (isTerminalDealStatus(status)) {
    return status === "won" ? "outline" : "destructive"
  }

  const categoryId = resolveCategory(pipelineCategoryId)
  if (!categoryId) return "secondary"

  const stepIndex = getDealStepIndex(status, categoryId)
  const role = workflowStepRole(
    stepIndex,
    getPipelineWorkflowSteps(categoryId).length,
  )

  switch (role) {
    case "lead":
    case "qualification":
    case "offer":
    case "negotiation":
      return "secondary"
  }
}

export function dealStatusIndicatorVariant(
  status: DealStatus,
  pipelineCategoryId?: string,
): "default" | "success" | "error" | "warning" | "info" {
  if (status === "won") return "success"
  if (status === "lost") return "error"

  const categoryId = resolveCategory(pipelineCategoryId)
  if (!categoryId) return "info"

  const stepIndex = getDealStepIndex(status, categoryId)
  const role = workflowStepRole(
    stepIndex,
    getPipelineWorkflowSteps(categoryId).length,
  )

  switch (role) {
    case "lead":
    case "qualification":
      return "info"
    case "offer":
    case "negotiation":
      return "warning"
  }
}

export function canFinishDeal(
  status: DealStatus,
  pipelineCategoryId?: string,
): boolean {
  const categoryId = resolveCategory(pipelineCategoryId)
  if (!categoryId) return status !== "won" && status !== "lost"
  return isDealWorkflowStatus(status, categoryId)
}

export { isTerminalDealStatus }
