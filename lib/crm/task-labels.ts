import type { TaskPriority } from "@/types/crm"

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki",
}

export const TASK_PRIORITY_OPTIONS: readonly TaskPriority[] = [
  "low",
  "medium",
  "high",
] as const
