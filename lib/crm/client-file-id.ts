import type { ClientFile } from "@/types/crm"

export function createNextClientFileId(
  existing: readonly ClientFile[],
): string {
  const max = existing.reduce((acc, item) => {
    const match = /^client-file-(\d+)$/.exec(item.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `client-file-${String(max + 1).padStart(3, "0")}`
}
