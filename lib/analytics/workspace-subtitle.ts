import { ANALYTICS_TIME_PERIOD_LABELS } from "@/lib/analytics/analytics-labels"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type { DemoUser, KpiSnapshot } from "@/types/crm"

export function getAnalyticsWorkspaceSubtitle(
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
  users: readonly DemoUser[],
  kpi: KpiSnapshot,
): string {
  const periodLabel =
    ANALYTICS_TIME_PERIOD_LABELS[filters.timePeriod].toLowerCase()

  if (user.role === "executive") {
    return `Credit Agricole Bank Polska · ${kpi.byRegion.length} regiony · okres: ${periodLabel}`
  }

  if (user.role === "regional_manager") {
    const region = kpi.byRegion.find((row) => row.regionId === user.regionId)
    const advisorCount = users.filter(
      (entry) => entry.role === "advisor" && entry.regionId === user.regionId,
    ).length
    return `Region ${region?.regionName ?? "—"} · zespół ${advisorCount} doradców · okres: ${periodLabel}`
  }

  return "Panele operacyjne i plan sprzedaży — demo BK."
}
