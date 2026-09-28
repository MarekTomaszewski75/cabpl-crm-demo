import type { AuditEntry } from "@/types/crm"

export function createNextAuditId(existing: readonly AuditEntry[]): string {
  const max = existing.reduce((acc, entry) => {
    const match = /^audit-(\d+)$/.exec(entry.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `audit-${String(max + 1).padStart(3, "0")}`
}
