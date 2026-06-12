import { filterByScope } from "@/lib/rbac/scope"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { Client, DemoUser, ScopedEntity } from "@/types/crm"

export type AnalyticsScopeContext = {
  clients?: readonly Client[]
  /** Nazwa segmentu z KPI (np. „Średnie przedsiębiorstwo”) — join z `Client.segment`. */
  segmentNameForFilter?: string | null
  getClientId?: (item: ScopedEntity) => string | null | undefined
}

export function filterAnalyticsEntities<T extends ScopedEntity>(
  items: readonly T[],
  user: DemoUser,
  filters: Pick<AnalyticsGlobalFilters, "ownerIds" | "regionId" | "segmentId">,
  context?: AnalyticsScopeContext,
): T[] {
  let result = filterByScope(items, user)
  if (filters.ownerIds.length > 0) {
    result = result.filter((item) => filters.ownerIds.includes(item.ownerId))
  }
  if (filters.regionId) {
    result = result.filter((item) => item.regionId === filters.regionId)
  }
  if (
    filters.segmentId &&
    context?.clients?.length &&
    context.getClientId &&
    context.segmentNameForFilter
  ) {
    const segmentName = context.segmentNameForFilter
    result = result.filter((item) => {
      const clientId = context.getClientId!(item)
      if (!clientId) return false
      const client = context.clients!.find((entry) => entry.id === clientId)
      return client?.segment === segmentName
    })
  }
  return result
}

/** Filtr kategorii lejka — tylko deale (`scopedDeals`, sparkline dealowych). Leady bez zmian. */
export function applyPipelineCategoryFilter<
  T extends { pipelineCategoryId: string },
>(items: readonly T[], pipelineCategoryId: string | null | undefined): T[] {
  if (!pipelineCategoryId) return [...items]
  return items.filter((item) => item.pipelineCategoryId === pipelineCategoryId)
}
