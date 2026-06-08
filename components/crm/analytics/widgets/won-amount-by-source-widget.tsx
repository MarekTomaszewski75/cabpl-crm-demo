"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { WonAmountBySourceRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"

const CHART_COLORS = [
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-1)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
] as const

const chartConfig = {
  amountPln: {
    label: "Kwota",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function formatAxisPln(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} mln`
  }
  return `${Math.round(value / 1000)} tys.`
}

type WonAmountBySourceWidgetProps = {
  rows: WonAmountBySourceRow[]
}

export function WonAmountBySourceWidget({ rows }: WonAmountBySourceWidgetProps) {
  if (rows.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-2/1 min-h-60 w-full">
      <BarChart data={rows} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={-12}
          textAnchor="end"
          height={56}
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
              formatter={(value) => (
                <span className="font-mono tabular-nums">
                  {formatCurrencyPln(Number(value))}
                </span>
              )}
            />
          }
        />
        <Bar dataKey="amountPln" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {rows.map((row, index) => (
            <Cell
              key={row.source}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
