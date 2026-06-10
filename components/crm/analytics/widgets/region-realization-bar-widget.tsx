"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RegionRealizationBarRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"

const chartConfig = {
  planPln: {
    label: "Plan",
    color: "var(--chart-5)",
  },
  actualPln: {
    label: "Realizacja",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function formatAxisPln(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} mln`
  }
  return `${Math.round(value / 1000)} tys.`
}

type RegionRealizationBarWidgetProps = {
  rows: RegionRealizationBarRow[]
}

export function RegionRealizationBarWidget({
  rows,
}: RegionRealizationBarWidgetProps) {
  if (rows.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-2/1 min-h-60 w-full">
      <BarChart data={rows} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="regionName"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatAxisPln}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.regionName ?? ""
              }
              formatter={(value) => (
                <span className="font-mono tabular-nums">
                  {formatCurrencyPln(Number(value))}
                </span>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="planPln"
          fill="var(--color-planPln)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="actualPln"
          fill="var(--color-actualPln)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  )
}
