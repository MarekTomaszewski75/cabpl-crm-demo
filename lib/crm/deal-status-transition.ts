import {
  getPipelineSteps,
  isDealWorkflowStatus,
  isPipelineCategoryId,
  isTerminalDealStatus,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import type { DealStatus } from "@/types/crm"

/** Czy przeciągnięcie na ten status wymaga dialogu Wygrano / Stracony deal. */
export function requiresDealFinishDialog(
  targetStatus: DealStatus,
): targetStatus is "won" | "lost" {
  return targetStatus === "won" || targetStatus === "lost"
}

function resolveCategory(
  pipelineCategoryId: string,
): PipelineCategoryId | null {
  return isPipelineCategoryId(pipelineCategoryId) ? pipelineCategoryId : null
}

/** Czy można ustawić status workflow bez dialogu finalizacji. */
export function isDealWorkflowStatusChange(
  from: DealStatus,
  to: DealStatus,
  pipelineCategoryId: string,
): boolean {
  if (to === from) return false
  if (isTerminalDealStatus(from)) return false
  if (requiresDealFinishDialog(to)) return false

  const categoryId = resolveCategory(pipelineCategoryId)
  if (!categoryId) return false

  const pipeline = getPipelineSteps(categoryId)
  if (!pipeline.includes(from) || !pipeline.includes(to)) return false

  return (
    isDealWorkflowStatus(from, categoryId) &&
    isDealWorkflowStatus(to, categoryId)
  )
}
