"use client"

import { Cell, Label, Pie, PieChart } from "recharts"
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

export type AnalyticsPieDatum = {
  key: string
  label: string
  value: number
  fill?: string
}

type AnalyticsPieChartProps = {
  data: AnalyticsPieDatum[]
  centerLabel?: string
  centerSubLabel?: string
  valueFormatter?: (value: number) => string
  activeKey?: string | null
  onSliceClick?: (key: string) => void
  className?: string
}

function buildChartConfig(data: AnalyticsPieDatum[]): ChartConfig {
  return Object.fromEntries(
    data.map((entry, index) => [
      entry.key,
      {
        label: entry.label,
        color: entry.fill ?? CHART_COLORS[index % CHART_COLORS.length],
      },
    ]),
  )
}

export function AnalyticsPieChart({
  data,
  centerLabel,
  centerSubLabel,
  valueFormatter,
  activeKey,
  onSliceClick,
  className,
}: AnalyticsPieChartProps) {
  const visibleData = data.filter((entry) => entry.value > 0)
  const total = visibleData.reduce((sum, entry) => sum + entry.value, 0)

  if (visibleData.length === 0 || total <= 0) {
    return <AnalyticsWidgetEmpty />
  }

  const chartConfig = buildChartConfig(visibleData)
  const chartData = visibleData.map((entry, index) => ({
    ...entry,
    fill: entry.fill ?? CHART_COLORS[index % CHART_COLORS.length],
    sharePercent: Math.round((entry.value / total) * 100),
  }))

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square min-h-64 w-full max-w-sm", className)}
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => (
                <span className="font-mono tabular-nums">
                  {valueFormatter
                    ? valueFormatter(Number(value))
                    : String(value)}
                  {item?.payload?.sharePercent != null
                    ? ` (${item.payload.sharePercent}%)`
                    : ""}
                </span>
              )}
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          innerRadius="58%"
          outerRadius="82%"
          strokeWidth={2}
          onClick={(slice) => {
            const key = slice?.payload?.key
            if (typeof key === "string") {
              onSliceClick?.(key)
            }
          }}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.key}
              fill={entry.fill}
              opacity={
                activeKey && activeKey !== entry.key ? 0.45 : 1
              }
              className={onSliceClick ? "cursor-pointer" : undefined}
            />
          ))}
          {centerLabel ? (
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                  return null
                }
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-semibold"
                    >
                      {centerLabel}
                    </tspan>
                    {centerSubLabel ? (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 18}
                        className="fill-muted-foreground text-xs"
                      >
                        {centerSubLabel}
                      </tspan>
                    ) : null}
                  </text>
                )
              }}
            />
          ) : null}
        </Pie>
        {chartData.length > 1 ? (
          <ChartLegend content={<ChartLegendContent nameKey="label" />} />
        ) : null}
      </PieChart>
    </ChartContainer>
  )
}
