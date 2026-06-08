import type { LeadActivity } from "@/types/crm"

export function createNextLeadActivityId(
  existing: readonly LeadActivity[],
): string {
  const max = existing.reduce((acc, item) => {
    const match = /^lead-act-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `lead-act-${String(max + 1).padStart(3, "0")}`
}
