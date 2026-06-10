"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"
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

export type AnalyticsRadarEntity = {
  key: string
  label: string
  color?: string
  strokeDasharray?: string
  fillOpacity?: number
}

type AnalyticsRadarChartProps = {
  data: Record<string, string | number>[]
  entities: AnalyticsRadarEntity[]
  dimensionKey?: string
  maxValue?: number
  className?: string
}

function buildChartConfig(entities: AnalyticsRadarEntity[]): ChartConfig {
  return Object.fromEntries(
    entities.map((entity, index) => [
      entity.key,
      {
        label: entity.label,
        color: entity.color ?? CHART_COLORS[index % CHART_COLORS.length],
      },
    ]),
  )
}

export function AnalyticsRadarChart({
  data,
  entities,
  dimensionKey = "dimension",
  maxValue = 100,
  className,
}: AnalyticsRadarChartProps) {
  if (data.length === 0 || entities.length === 0) {
    return <AnalyticsWidgetEmpty />
  }

  const chartConfig = buildChartConfig(entities)

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square min-h-64 w-full max-w-md", className)}
    >
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid />
        <PolarAngleAxis dataKey={dimensionKey} tickLine={false} />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxValue]}
          tick={false}
          axisLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono tabular-nums">{String(value)}</span>
              )}
            />
          }
        />
        {entities.length > 1 ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {entities.map((entity) => (
          <Radar
            key={entity.key}
            name={entity.label}
            dataKey={entity.key}
            stroke={`var(--color-${entity.key})`}
            fill={`var(--color-${entity.key})`}
            fillOpacity={entity.fillOpacity ?? 0.3}
            strokeWidth={2}
            strokeDasharray={entity.strokeDasharray}
          />
        ))}
      </RadarChart>
    </ChartContainer>
  )
}
