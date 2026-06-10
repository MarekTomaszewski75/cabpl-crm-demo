"use client"

import { AnalyticsRadialChart } from "@/components/crm/analytics/charts/analytics-radial-chart"
import type { RegionPlanRealization } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"

type RegionPlanRadialWidgetProps = {
  data: RegionPlanRealization
}

export function RegionPlanRadialWidget({ data }: RegionPlanRadialWidgetProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <AnalyticsRadialChart
        value={data.realizationPercent}
        label={data.regionName}
      />
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-muted-foreground">Realizacja planu</p>
        <p className="text-lg font-semibold tabular-nums">
          {formatCurrencyPln(data.actualPln)}
        </p>
        <p className="text-xs text-muted-foreground">
          z {formatCurrencyPln(data.planPln)} planu
        </p>
      </div>
    </div>
  )
}
