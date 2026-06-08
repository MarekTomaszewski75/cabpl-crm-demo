import type { Employee } from "@/types/crm"

export function createNextEmployeeId(existing: readonly Employee[]): string {
  const max = existing.reduce((acc, emp) => {
    const match = /^emp-(\d+)$/.exec(emp.id)
    if (!match) return acc
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `emp-${String(max + 1).padStart(3, "0")}`
}
