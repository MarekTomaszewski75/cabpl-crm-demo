"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { AnalyticsWidgetEmpty } from "@/components/crm/analytics/widgets/analytics-widget-empty"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { TasksByPriorityRow } from "@/lib/analytics/metrics"
import type { TaskPriority } from "@/types/crm"

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "var(--chart-5)",
  medium: "var(--chart-3)",
  high: "var(--chart-2)",
}

const chartConfig = {
  count: {
    label: "Liczba zadań",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

type TasksByPriorityWidgetProps = {
  rows: TasksByPriorityRow[]
}

export function TasksByPriorityWidget({ rows }: TasksByPriorityWidgetProps) {
  if (rows.every((row) => row.count === 0)) {
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
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {rows.map((row) => (
            <Cell key={row.priority} fill={PRIORITY_COLORS[row.priority]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
