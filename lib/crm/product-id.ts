import type { Product } from "@/types/crm"

export function createNextProductId(existing: readonly Product[]): string {
  const max = existing.reduce((acc, product) => {
    const match = /^prod-(\d+)$/.exec(product.id)
    if (!match) {
      return acc
    }
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `prod-${String(max + 1).padStart(3, "0")}`
}
