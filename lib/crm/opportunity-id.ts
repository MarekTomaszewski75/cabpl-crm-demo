import type { Opportunity } from "@/types/crm"

export function createNextOpportunityId(
  existing: readonly Opportunity[],
): string {
  const max = existing.reduce((acc, opp) => {
    const match = /^opp-(\d+)$/.exec(opp.id)
    if (!match) {
      return acc
    }
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `opp-${String(max + 1).padStart(3, "0")}`
}
