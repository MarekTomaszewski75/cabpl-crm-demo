import type { DemoUser, SalesDictionaryItem, UserRole } from "@/types/crm"

/** Kto może zatwierdzać zmiany słowników (US-58). */
export const SALES_DICTIONARY_APPROVER_ROLES: readonly UserRole[] = [
  "business_admin",
  "regional_manager",
]

/** Zasada czterech oczu: zatwierdza administrator lub menedżer, ale nie autor zgłoszenia. */
export function canDecideSalesDictionaryChange(
  user: DemoUser,
  item: Pick<SalesDictionaryItem, "proposedByUserId">,
): boolean {
  return (
    SALES_DICTIONARY_APPROVER_ROLES.includes(user.role) &&
    item.proposedByUserId !== user.id
  )
}
