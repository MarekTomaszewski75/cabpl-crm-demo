"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

export type AnalyticsAreaSeries = {
  key: string
  label: string
  color?: string
  stackId?: string
}

type AnalyticsAreaChartProps = {
  data: Record<string, string | number>[]
  series: AnalyticsAreaSeries[]
  valueFormatter?: (value: number) => string
  stacked?: boolean
  className?: string
}

function buildChartConfig(series: AnalyticsAreaSeries[]): ChartConfig {
  return Object.fromEntries(
    series.map((entry, index) => [
      entry.key,
      {
        label: entry.label,
        color: entry.color ?? CHART_COLORS[index % CHART_COLORS.length],
      },
    ]),
  )
}

export function AnalyticsAreaChart({
  data,
  series,
  valueFormatter,
  stacked = false,
  className,
}: AnalyticsAreaChartProps) {
  if (data.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  const chartConfig = buildChartConfig(series)

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-2/1 min-h-60 w-full", className)}
    >
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={
            valueFormatter
              ? (value) => valueFormatter(Number(value))
              : undefined
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                valueFormatter ? (
                  <span className="font-mono tabular-nums">
                    {valueFormatter(Number(value))}
                  </span>
                ) : (
                  <span className="font-mono tabular-nums">{String(value)}</span>
                )
              }
            />
          }
        />
        {series.length > 1 ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {series.map((entry) => (
          <Area
            key={entry.key}
            type="monotone"
            dataKey={entry.key}
            stackId={stacked ? (entry.stackId ?? "stack") : undefined}
            stroke={`var(--color-${entry.key})`}
            fill={`var(--color-${entry.key})`}
            fillOpacity={stacked ? 0.55 : 0.2}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
