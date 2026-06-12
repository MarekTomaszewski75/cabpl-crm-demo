import type { LeadFile } from "@/types/crm"

export function createNextLeadFileId(existing: readonly LeadFile[]): string {
  const max = existing.reduce((acc, item) => {
    const match = /^lead-file-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `lead-file-${String(max + 1).padStart(3, "0")}`
}
