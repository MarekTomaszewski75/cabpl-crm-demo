"use client"

import * as React from "react"
import {
  AnalyticsRadarChart,
  type AnalyticsRadarEntity,
} from "@/components/crm/analytics/charts/analytics-radar-chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import type { AdvisorRadarData } from "@/lib/analytics/metrics"
import type { AnalyticsGlobalFilters } from "@/types/analytics"

type AdvisorRadarWidgetProps = {
  data: AdvisorRadarData
  filters: AnalyticsGlobalFilters
}

export function AdvisorRadarWidget({
  data,
  filters,
}: AdvisorRadarWidgetProps) {
  const chartData = React.useMemo(
    () =>
      data.dimensions.map((dimension, index) => {
        const row: Record<string, string | number> = {
          dimension: dimension.label,
        }
        for (const series of data.series) {
          row[series.ownerId] = series.scores[index] ?? 0
        }
        if (
          filters.ownerIds.length === 1 &&
          data.teamAverageScores.length > 0
        ) {
          row.teamAverage = data.teamAverageScores[index] ?? 0
        }
        return row
      }),
    [data, filters.ownerIds.length],
  )

  const entities = React.useMemo((): AnalyticsRadarEntity[] => {
    const advisorEntities: AnalyticsRadarEntity[] = data.series.map(
      (series) => ({
        key: series.ownerId,
        label: series.ownerName.split(" ")[0] ?? series.ownerName,
      }),
    )
    if (filters.ownerIds.length === 1) {
      advisorEntities.push({
        key: "teamAverage",
        label: "Średnia zespołu",
        color: "var(--chart-4)",
        strokeDasharray: "4 4",
        fillOpacity: 0.1,
      })
    }
    return advisorEntities
  }, [data.series, filters.ownerIds.length])

  if (data.series.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  return <AnalyticsRadarChart data={chartData} entities={entities} />
}
