import type { LeadDocument } from "@/types/crm"

export function createNextLeadDocumentId(
  existing: readonly LeadDocument[],
): string {
  const max = existing.reduce((acc, item) => {
    const match = /^lead-doc-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `lead-doc-${String(max + 1).padStart(3, "0")}`
}
