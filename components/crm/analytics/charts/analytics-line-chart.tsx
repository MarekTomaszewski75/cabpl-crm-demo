"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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
  "var(--chart-2)",
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

export type AnalyticsLineSeries = {
  key: string
  label: string
  color?: string
  strokeDasharray?: string
}

type AnalyticsLineChartProps = {
  data: Record<string, string | number>[]
  series: AnalyticsLineSeries[]
  yAxisPercent?: boolean
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  className?: string
}

function buildChartConfig(series: AnalyticsLineSeries[]): ChartConfig {
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

export function AnalyticsLineChart({
  data,
  series,
  yAxisPercent = false,
  valueFormatter,
  showLegend = true,
  className,
}: AnalyticsLineChartProps) {
  if (data.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  const chartConfig = buildChartConfig(series)

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-2/1 min-h-60 w-full", className)}
    >
      <LineChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
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
          domain={yAxisPercent ? [0, 100] : undefined}
          tickFormatter={
            yAxisPercent
              ? (value) => `${value}%`
              : valueFormatter
                ? (value) => valueFormatter(Number(value))
                : undefined
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono tabular-nums">
                  {yAxisPercent
                    ? `${Number(value)}%`
                    : valueFormatter
                      ? valueFormatter(Number(value))
                      : String(value)}
                </span>
              )}
            />
          }
        />
        {showLegend && series.length > 1 ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {series.map((entry) => (
          <Line
            key={entry.key}
            type="monotone"
            dataKey={entry.key}
            stroke={`var(--color-${entry.key})`}
            strokeWidth={2}
            strokeDasharray={entry.strokeDasharray}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
