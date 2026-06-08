"use client"

import { Area, AreaChart } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import type { SparklinePoint } from "@/lib/analytics/sparkline"

type AnalyticsMiniSparklineProps = {
  data: SparklinePoint[]
  gradientId: string
  color?: string
}

export function AnalyticsMiniSparkline({
  data,
  gradientId,
  color = "var(--chart-2)",
}: AnalyticsMiniSparklineProps) {
  const chartConfig = {
    value: { label: "Trend", color },
  } satisfies ChartConfig

  if (data.every((point) => point.value === 0)) {
    return (
      <div className="flex h-14 items-end gap-1 px-1">
        {data.map((point) => (
          <div
            key={point.label}
            className="flex-1 rounded-t-sm bg-muted"
            style={{ height: "20%" }}
            title={point.label}
          />
        ))}
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-14 w-full">
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
