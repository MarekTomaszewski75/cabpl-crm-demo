import { isTerminalLeadStatus } from "@/lib/crm/lead-labels"
import type { Lead, LeadStatus } from "@/types/crm"

/** Czy przeciągnięcie / zmiana na ten status wymaga dialogu Wygrano / Niepowodzenie. */
export function requiresLeadFinishDialog(
  targetStatus: LeadStatus,
  currentStatus: LeadStatus,
): targetStatus is "won" | "lost" {
  if (targetStatus === currentStatus) return false
  if (isTerminalLeadStatus(currentStatus)) return false
  return targetStatus === "won" || targetStatus === "lost"
}

/** Czy można ustawić status workflow (Nowy / W toku) bez dialogu finalizacji. */
export function isWorkflowStatusChange(
  targetStatus: LeadStatus,
  currentStatus: LeadStatus,
): boolean {
  if (targetStatus === currentStatus) return false
  if (isTerminalLeadStatus(currentStatus)) return false
  return (
    (targetStatus === "new" || targetStatus === "in_progress") &&
    (currentStatus === "new" || currentStatus === "in_progress")
  )
}
