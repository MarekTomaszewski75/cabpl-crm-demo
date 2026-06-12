import type { DealFile } from "@/types/crm"

export function createNextDealFileId(existing: readonly DealFile[]): string {
  const max = existing.reduce((acc, item) => {
    const match = /^deal-file-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `deal-file-${String(max + 1).padStart(3, "0")}`
}
