import type { DealDocument } from "@/types/crm"

export function createNextDealDocumentId(
  existing: readonly DealDocument[],
): string {
  const max = existing.reduce((acc, item) => {
    const match = /^deal-doc-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `deal-doc-${String(max + 1).padStart(3, "0")}`
}
