import type { ClientDocument } from "@/types/crm"

export function createNextClientDocumentId(
  existing: readonly ClientDocument[],
): string {
  const max = existing.reduce((acc, item) => {
    const match = /^client-doc-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `client-doc-${String(max + 1).padStart(3, "0")}`
}
