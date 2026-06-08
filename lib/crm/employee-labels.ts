import type { EmployeeStatus } from "@/types/crm"

export function employeeStatusBadgeVariant(
  status: EmployeeStatus,
): "default" | "secondary" {
  return status === "active" ? "default" : "secondary"
}
