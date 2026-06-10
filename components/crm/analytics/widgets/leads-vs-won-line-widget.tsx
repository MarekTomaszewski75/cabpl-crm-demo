"use client"

import { AnalyticsLineChart } from "@/components/crm/analytics/charts/analytics-line-chart"
import type { LeadsVsWonTrendRow } from "@/lib/analytics/metrics"

const SERIES = [
  {
    key: "leadsCount",
    label: "Nowe leady",
    color: "var(--chart-1)",
  },
  {
    key: "wonDealsCount",
    label: "Wygrane deale",
    color: "var(--chart-2)",
  },
] as const

type LeadsVsWonLineWidgetProps = {
  rows: LeadsVsWonTrendRow[]
}

export function LeadsVsWonLineWidget({ rows }: LeadsVsWonLineWidgetProps) {
  return (
    <AnalyticsLineChart data={rows} series={[...SERIES]} showLegend />
  )
}
