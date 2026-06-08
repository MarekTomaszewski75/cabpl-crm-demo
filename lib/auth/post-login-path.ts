import type { DemoUser } from "@/types/crm"

/** Docelowa trasa po mock logowaniu (US-05 rozszerzy stub routów). */
export function getPostLoginPath(user: DemoUser): string {
  if (user.role === "executive") return "/dashboard"
  if (user.role === "advisor") return "/today"
  return "/pipeline"
}
