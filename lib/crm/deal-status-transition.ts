import { isTerminalDealStatus } from "@/lib/crm/deal-labels"
import type { DealStatus } from "@/types/crm"

/** Czy przeciągnięcie na ten status wymaga dialogu Wygrano / Stracony deal. */
export function requiresDealFinishDialog(
  targetStatus: DealStatus,
  currentStatus: DealStatus,
): targetStatus is "won" | "lost" {
  if (targetStatus === currentStatus) return false
  if (isTerminalDealStatus(currentStatus)) return false
  return targetStatus === "won" || targetStatus === "lost"
}

/** Czy można ustawić status workflow bez dialogu finalizacji. */
export function isDealWorkflowStatusChange(
  targetStatus: DealStatus,
  currentStatus: DealStatus,
): boolean {
  if (targetStatus === currentStatus) return false
  if (isTerminalDealStatus(currentStatus)) return false
  return (
    targetStatus !== "won" &&
    targetStatus !== "lost" &&
    !isTerminalDealStatus(currentStatus)
  )
}
