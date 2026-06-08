import type { DealActivity } from "@/types/crm"

export function createNextDealActivityId(
  activities: readonly DealActivity[],
): string {
  const max = activities.reduce((current, item) => {
    const match = item.id.match(/^deal-activity-(\d+)$/)
    if (!match) return current
    const num = Number(match[1])
    return Number.isFinite(num) ? Math.max(current, num) : current
  }, 0)
  return `deal-activity-${String(max + 1).padStart(3, "0")}`
}

