"use client"

import { AnalyticsLineChart } from "@/components/crm/analytics/charts/analytics-line-chart"
import type { ForecastScenariosTrendRow } from "@/lib/analytics/metrics"

function formatAxisPln(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} mln`
  }
  return `${Math.round(value / 1000)} tys.`
}

const SERIES = [
  {
    key: "forecastPln",
    label: "Bazowy",
    color: "var(--chart-1)",
  },
  {
    key: "forecastOptimisticPln",
    label: "Optymistyczny",
    color: "var(--chart-3)",
  },
  {
    key: "forecastPessimisticPln",
    label: "Pesymistyczny",
    color: "var(--chart-4)",
  },
] as const

type ForecastScenariosLineWidgetProps = {
  rows: ForecastScenariosTrendRow[]
}

export function ForecastScenariosLineWidget({
  rows,
}: ForecastScenariosLineWidgetProps) {
  return (
    <AnalyticsLineChart
      data={rows}
      series={[...SERIES]}
      valueFormatter={formatAxisPln}
    />
  )
}
