"use client"

import { AnalyticsAreaChart } from "@/components/crm/analytics/charts/analytics-area-chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import type { PlanActualTrendRow } from "@/lib/analytics/metrics"

function formatAxisPln(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} mln`
  }
  return `${Math.round(value / 1000)} tys.`
}

const SERIES = [
  { key: "planPln", label: "Plan", color: "var(--chart-5)" },
  { key: "actualPln", label: "Realizacja", color: "var(--chart-2)" },
  { key: "forecastPln", label: "Forecast", color: "var(--chart-1)" },
] as const

type PlanActualAreaWidgetProps = {
  rows: PlanActualTrendRow[]
}

export function PlanActualAreaWidget({ rows }: PlanActualAreaWidgetProps) {
  if (rows.length === 0) {
    return <AnalyticsWidgetEmpty message="Brak danych planu w wybranym okresie" />
  }

  return (
    <AnalyticsAreaChart
      data={rows}
      series={[...SERIES]}
      valueFormatter={formatAxisPln}
      className="min-h-72"
    />
  )
}
