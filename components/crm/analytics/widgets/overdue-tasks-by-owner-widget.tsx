"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { OverdueTasksByOwnerRow } from "@/lib/analytics/metrics"

const CHART_COLORS = [
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-1)",
  "var(--chart-5)",
] as const

const chartConfig = {
  count: {
    label: "Liczba zadań",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

type OverdueTasksByOwnerWidgetProps = {
  rows: OverdueTasksByOwnerRow[]
}

export function OverdueTasksByOwnerWidget({
  rows,
}: OverdueTasksByOwnerWidgetProps) {
  if (rows.length === 0) {
    return (
      <AnalyticsWidgetEmpty message="Brak zaległych zadań w wybranym okresie" />
    )
  }

  const chartData = rows.map((row) => ({
    ...row,
    shortName:
      row.ownerName.split(" ")[0] ?? row.ownerName,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-2/1 min-h-60 w-full">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          type="category"
          dataKey="shortName"
          width={72}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.ownerName ?? ""
              }
            />
          }
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
          {chartData.map((row, index) => (
            <Cell
              key={row.ownerId}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
