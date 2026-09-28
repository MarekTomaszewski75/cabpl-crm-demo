import { isDealWorkflowStatus } from "@/lib/crm/deal-pipeline"
import type { Deal, DealStatus } from "@/types/crm"

export const CREDIT_STAGE_GATE_CATEGORY = "pcat-credit" as const

export const CREDIT_STAGE_CHECKLIST = [
  {
    id: "needs",
    labelPl: "Potwierdzona potrzeba kredytowa",
  },
  {
    id: "documents",
    labelPl: "Wysłana lista dokumentów",
  },
  {
    id: "decision_maker",
    labelPl: "Znany decydent po stronie klienta",
  },
] as const

export type CreditStageChecklistId =
  (typeof CREDIT_STAGE_CHECKLIST)[number]["id"]

export function emptyCreditStageChecklist(): Record<string, boolean> {
  return Object.fromEntries(
    CREDIT_STAGE_CHECKLIST.map((item) => [item.id, false]),
  )
}

export function isCreditStageGateComplete(
  deal: Pick<Deal, "amount" | "expectedCloseDate" | "stageChecklist">,
): boolean {
  if (deal.amount == null || deal.amount <= 0) return false
  if (!deal.expectedCloseDate?.trim()) return false
  return CREDIT_STAGE_CHECKLIST.every(
    (item) => deal.stageChecklist?.[item.id] === true,
  )
}

/** Wyjście z etapu „Nowy” w lejku kredytowym wymaga kwoty, daty i checklisty. */
export function requiresCreditStageGate(
  deal: Deal,
  nextStatus: DealStatus,
): boolean {
  if (deal.pipelineCategoryId !== CREDIT_STAGE_GATE_CATEGORY) return false
  if (deal.status !== "new") return false
  if (nextStatus === "new" || nextStatus === "won" || nextStatus === "lost") {
    return false
  }
  if (!isDealWorkflowStatus(nextStatus, CREDIT_STAGE_GATE_CATEGORY)) {
    return false
  }
  return !isCreditStageGateComplete(deal)
}
