import type { Task } from "@/types/crm"

export function createNextTaskId(existing: readonly Task[]): string {
  const max = existing.reduce((acc, task) => {
    const match = /^task-(\d+)$/.exec(task.id)
    if (!match) {
      return acc
    }
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `task-${String(max + 1).padStart(3, "0")}`
}
