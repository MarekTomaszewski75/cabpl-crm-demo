"use client"

import { AnalyticsLineChart } from "@/components/crm/analytics/charts/analytics-line-chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import type { LeadConversionTrendRow } from "@/lib/analytics/metrics"

const SERIES = [{ key: "conversionPercent", label: "Konwersja lead → deal" }] as const

type LeadConversionLineWidgetProps = {
  rows: LeadConversionTrendRow[]
}

export function LeadConversionLineWidget({ rows }: LeadConversionLineWidgetProps) {
  const hasData = rows.some((row) => row.conversionPercent > 0)

  if (!hasData) {
    return (
      <AnalyticsWidgetEmpty message="Brak zamkniętych leadów w wybranym okresie" />
    )
  }

  return (
    <AnalyticsLineChart
      data={rows}
      series={[...SERIES]}
      yAxisPercent
      showLegend={false}
    />
  )
}
