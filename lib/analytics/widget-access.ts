import type { AnalyticsWidgetDefinition } from "@/types/analytics"
import type { DemoUser, UserRole } from "@/types/crm"

export function isWidgetAvailableForRole(
  definition: AnalyticsWidgetDefinition,
  role: UserRole,
): boolean {
  if (definition.allowedRoles?.length) {
    return definition.allowedRoles.includes(role)
  }
  if (definition.restrictedRoles?.length) {
    return !definition.restrictedRoles.includes(role)
  }
  return true
}

export function canViewAnalyticsWidget(
  definition: AnalyticsWidgetDefinition,
  user: DemoUser,
): boolean {
  return isWidgetAvailableForRole(definition, user.role)
}

export function isAnalyticsWidgetRestricted(
  definition: AnalyticsWidgetDefinition,
  user: DemoUser,
): boolean {
  return !canViewAnalyticsWidget(definition, user)
}
