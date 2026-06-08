import { filterByScope } from "@/lib/rbac/scope"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { DemoUser, ScopedEntity } from "@/types/crm"

export function filterAnalyticsEntities<T extends ScopedEntity>(
  items: readonly T[],
  user: DemoUser,
  filters: Pick<AnalyticsGlobalFilters, "ownerIds">,
): T[] {
  let result = filterByScope(items, user)
  if (filters.ownerIds.length > 0) {
    result = result.filter((item) => filters.ownerIds.includes(item.ownerId))
  }
  return result
}
