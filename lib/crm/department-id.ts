import type { Department } from "@/types/crm"

export function createNextDepartmentId(existing: readonly Department[]): string {
  const max = existing.reduce((acc, dept) => {
    const match = /^dept-(\d+)$/.exec(dept.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `dept-${String(max + 1).padStart(3, "0")}`
}
