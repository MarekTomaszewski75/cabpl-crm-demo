"use client"

import { AnalyticsAreaChart } from "@/components/crm/analytics/charts/analytics-area-chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import type { TeamActivityTimelineRow } from "@/lib/analytics/metrics"

const SERIES = [
  { key: "leads", label: "Nowe leady", stackId: "activity" },
  { key: "dealsWon", label: "Wygrane deale", stackId: "activity" },
  { key: "tasksDone", label: "Zamknięte zadania", stackId: "activity" },
] as const

type TeamActivityAreaWidgetProps = {
  rows: TeamActivityTimelineRow[]
}

export function TeamActivityAreaWidget({ rows }: TeamActivityAreaWidgetProps) {
  const hasData = rows.some(
    (row) => row.leads > 0 || row.dealsWon > 0 || row.tasksDone > 0,
  )

  if (!hasData) {
    return (
      <AnalyticsWidgetEmpty message="Brak aktywności zespołu w wybranym okresie" />
    )
  }

  return (
    <AnalyticsAreaChart
      data={rows}
      series={[...SERIES]}
      stacked
    />
  )
}
