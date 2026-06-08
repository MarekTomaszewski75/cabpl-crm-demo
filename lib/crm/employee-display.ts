import type { Employee } from "@/types/crm"

export function formatEmployeeName(employee: Pick<Employee, "firstName" | "middleName" | "lastName">): string {
  const parts = [employee.firstName, employee.middleName, employee.lastName].filter(
    (p): p is string => Boolean(p?.trim()),
  )
  return parts.join(" ")
}
