"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartConfig = {
  realization: {
    label: "Realizacja",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type AnalyticsRadialChartProps = {
  value: number
  label?: string
  size?: "sm" | "md"
  className?: string
}

export function AnalyticsRadialChart({
  value,
  label,
  size = "md",
  className,
}: AnalyticsRadialChartProps) {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)))
  const chartData = [{ value: clampedValue, fill: "var(--color-realization)" }]
  const isSmall = size === "sm"

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "aspect-square mx-auto",
        isSmall ? "size-20" : "size-28",
        className,
      )}
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={isSmall ? 28 : 40}
        outerRadius={isSmall ? 38 : 54}
      >
        <RadialBar
          background={{ fill: "var(--muted)" }}
          dataKey="value"
          cornerRadius={isSmall ? 6 : 8}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                    className={cn(
                      "fill-foreground font-semibold tabular-nums",
                      isSmall ? "text-sm" : "text-base",
                    )}
                  >
                    {clampedValue}%
                  </tspan>
                  {label ? (
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + (isSmall ? 14 : 16)}
                      className="fill-muted-foreground text-[10px]"
                    >
                      {label}
                    </tspan>
                  ) : null}
                </text>
              )
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
