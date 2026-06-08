import type { Client } from "@/types/crm"

export function createNextClientId(existing: readonly Client[]): string {
  const max = existing.reduce((acc, client) => {
    const match = /^client-(\d+)$/.exec(client.id)
    if (!match) {
      return acc
    }
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `client-${String(max + 1).padStart(3, "0")}`
}
