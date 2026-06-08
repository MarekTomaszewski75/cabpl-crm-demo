import type { Lead } from "@/types/crm"

export function createNextLeadId(existing: readonly Lead[]): string {
  const max = existing.reduce((acc, lead) => {
    const match = /^lead-(\d+)$/.exec(lead.id)
    if (!match) {
      return acc
    }
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `lead-${String(max + 1).padStart(3, "0")}`
}
