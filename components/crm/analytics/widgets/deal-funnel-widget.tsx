"use client"

import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import type { DealFunnelRow } from "@/lib/analytics/metrics"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
] as const

const chartConfig = {
  count: { label: "Liczba dealów", color: "var(--chart-2)" },
} satisfies ChartConfig

type DealFunnelWidgetProps = {
  rows: DealFunnelRow[]
}

export function DealFunnelWidget({ rows }: DealFunnelWidgetProps) {
  if (rows.every((row) => row.count === 0)) {
    return <AnalyticsWidgetEmpty />
  }

  const chartData = rows.map((row) => ({
    ...row,
    shortLabel:
      row.label.length > 18 ? `${row.label.slice(0, 16)}…` : row.label,
  }))

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfig} className="min-h-64 w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={108}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ?? ""
                }
              />
            }
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
            {chartData.map((row, index) => (
              <Cell
                key={row.stage}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="flex flex-wrap gap-2">
        {rows.map((row, index) => (
          <div
            key={row.stage}
            className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs"
          >
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium tabular-nums">{row.count}</span>
            {row.stage === "won" ? (
              <Badge variant="outline" className="font-normal">
                Wkrótce
              </Badge>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
