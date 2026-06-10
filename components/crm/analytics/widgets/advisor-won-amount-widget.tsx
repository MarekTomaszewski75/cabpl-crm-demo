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
import type { AdvisorWonAmountRow } from "@/lib/analytics/metrics"
import { formatCurrencyPln } from "@/lib/format/pl"

const chartConfig = {
  amountPln: {
    label: "Wygrane",
    color: "var(--chart-2)",
  },
  planPln: {
    label: "Plan",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

function formatAxisPln(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} mln`
  }
  return `${Math.round(value / 1000)} tys.`
}

type AdvisorWonAmountWidgetProps = {
  rows: AdvisorWonAmountRow[]
}

export function AdvisorWonAmountWidget({ rows }: AdvisorWonAmountWidgetProps) {
  const visibleRows = rows.filter(
    (row) => row.amountPln > 0 || row.planPln > 0,
  )

  if (visibleRows.length === 0) {
    return (
      <AnalyticsWidgetEmpty message="Brak wygranych dealów w wybranym okresie" />
    )
  }

  const chartData = visibleRows.map((row) => ({
    ...row,
    shortName: row.ownerName.split(" ")[0] ?? row.ownerName,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-2/1 min-h-60 w-full">
      <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="shortName"
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
                payload?.[0]?.payload?.ownerName ?? ""
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
          dataKey="amountPln"
          fill="var(--color-amountPln)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="planPln"
          fill="var(--color-planPln)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  )
}
