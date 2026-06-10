"use client"

import { AnalyticsMiniSparkline } from "@/components/crm/analytics/widgets/analytics-mini-sparkline"
import { AnalyticsRadialChart } from "@/components/crm/analytics/charts/analytics-radial-chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RegionScorecardRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"
import { cn } from "@/lib/utils"

type RegionScorecardTableWidgetProps = {
  rows: RegionScorecardRow[]
  activeRegionId?: string | null
  onRegionSelect?: (regionId: string) => void
}

export function RegionScorecardTableWidget({
  rows,
  activeRegionId,
  onRegionSelect,
}: RegionScorecardTableWidgetProps) {
  if (rows.length === 0) {
    return <AnalyticsWidgetEmpty message="Brak danych scorecard regionów" />
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Plan</TableHead>
            <TableHead className="text-right">Realizacja</TableHead>
            <TableHead className="text-right">%</TableHead>
            <TableHead className="text-right">Forecast</TableHead>
            <TableHead className="text-right">Luka</TableHead>
            <TableHead className="text-right">Otwarte deale</TableHead>
            <TableHead className="min-w-28">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.regionId}
              className={cn(
                onRegionSelect && "cursor-pointer",
                activeRegionId === row.regionId && "bg-muted/50",
              )}
              onClick={() => onRegionSelect?.(row.regionId)}
            >
              <TableCell className="font-medium">{row.regionName}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyPln(row.planPln)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyPln(row.actualPln)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="tabular-nums">{row.realizationPercent}%</span>
                  <AnalyticsRadialChart
                    value={row.realizationPercent}
                    size="sm"
                    className="size-12"
                  />
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyPln(row.forecastPln)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyPln(row.gapPln)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <div className="flex flex-col items-end gap-0.5">
                  <span>{row.openDealsCount}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrencyPln(row.openDealsAmountPln)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <AnalyticsMiniSparkline
                  data={row.actualTrend}
                  gradientId={`region-${row.regionId}`}
                  color="var(--chart-2)"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
