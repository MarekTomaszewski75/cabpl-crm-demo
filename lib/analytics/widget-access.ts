import type { AnalyticsWidgetDefinition } from "@/types/analytics"
import type { DemoUser } from "@/types/crm"

export function canViewAnalyticsWidget(
  definition: AnalyticsWidgetDefinition,
  user: DemoUser,
): boolean {
  if (!definition.restrictedRoles?.length) return true
  return !definition.restrictedRoles.includes(user.role)
}

export function isAnalyticsWidgetRestricted(
  definition: AnalyticsWidgetDefinition,
  user: DemoUser,
): boolean {
  return !canViewAnalyticsWidget(definition, user)
}
