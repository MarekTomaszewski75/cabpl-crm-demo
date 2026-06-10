"use client"

import * as React from "react"
import {
  AnalyticsRadarChart,
  type AnalyticsRadarEntity,
} from "@/components/crm/analytics/charts/analytics-radar-chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import type { RegionRadarData } from "@/lib/analytics/metrics"

type RegionRadarWidgetProps = {
  data: RegionRadarData
}

export function RegionRadarWidget({ data }: RegionRadarWidgetProps) {
  const chartData = React.useMemo(
    () =>
      data.dimensions.map((dimension, index) => {
        const row: Record<string, string | number> = {
          dimension: dimension.label,
        }
        for (const series of data.series) {
          row[series.regionId] = series.scores[index] ?? 0
        }
        return row
      }),
    [data],
  )

  const entities = React.useMemo((): AnalyticsRadarEntity[] => {
    return data.series.map((series, index) => ({
      key: series.regionId,
      label: series.regionName,
      color: `var(--chart-${index + 1})`,
    }))
  }, [data.series])

  if (data.series.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  return <AnalyticsRadarChart data={chartData} entities={entities} />
}
