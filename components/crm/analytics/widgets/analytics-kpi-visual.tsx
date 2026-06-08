"use client"

import {
  AlertTriangleIcon,
  BanknoteIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  Clock3Icon,
  type LucideIcon,
  UserPlusIcon,
} from "lucide-react"
import { AnalyticsMiniSparkline } from "@/components/crm/analytics/widgets/analytics-mini-sparkline"
import type { SparklinePoint } from "@/lib/analytics/sparkline"
import { cn } from "@/lib/utils"

type KpiVisualConfig = {
  icon: LucideIcon
  iconWrap: string
  sparkColor: string
  caption: string
}

const KPI_VISUALS: Record<string, KpiVisualConfig> = {
  "new-leads": {
    icon: UserPlusIcon,
    iconWrap: "bg-chart-1/25 text-chart-2",
    sparkColor: "var(--chart-2)",
    caption: "Nowe leady w okresie",
  },
  "won-deals": {
    icon: CheckCircle2Icon,
    iconWrap: "bg-primary/15 text-primary",
    sparkColor: "var(--chart-2)",
    caption: "Deale wygrane w okresie",
  },
  "open-deals": {
    icon: BriefcaseIcon,
    iconWrap: "bg-chart-3/15 text-chart-3",
    sparkColor: "var(--chart-3)",
    caption: "Aktywne deale w okresie",
  },
  "overdue-tasks": {
    icon: AlertTriangleIcon,
    iconWrap: "bg-destructive/10 text-destructive",
    sparkColor: "var(--chart-4)",
    caption: "Zadania po terminie",
  },
  "avg-deal-value": {
    icon: BanknoteIcon,
    iconWrap: "bg-chart-2/15 text-chart-2",
    sparkColor: "var(--chart-2)",
    caption: "Średnia wartość (tys. PLN)",
  },
  "avg-deal-duration": {
    icon: Clock3Icon,
    iconWrap: "bg-chart-5/20 text-chart-4",
    sparkColor: "var(--chart-5)",
    caption: "Średni czas zamknięcia",
  },
}

const DEFAULT_VISUAL: KpiVisualConfig = {
  icon: BriefcaseIcon,
  iconWrap: "bg-muted text-muted-foreground",
  sparkColor: "var(--chart-2)",
  caption: "Metryka operacyjna",
}

type AnalyticsKpiVisualProps = {
  widgetId: string
  value: React.ReactNode
  sparkline: SparklinePoint[]
  footer?: React.ReactNode
}

export function AnalyticsKpiVisual({
  widgetId,
  value,
  sparkline,
  footer,
}: AnalyticsKpiVisualProps) {
  const visual = KPI_VISUALS[widgetId] ?? DEFAULT_VISUAL
  const Icon = visual.icon

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            visual.iconWrap,
          )}
        >
          <Icon aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="font-heading text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </div>
          <p className="text-xs text-muted-foreground">{visual.caption}</p>
          {footer ? (
            <div className="mt-1 text-xs text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </div>
      <AnalyticsMiniSparkline
        data={sparkline}
        gradientId={`spark-${widgetId}`}
        color={visual.sparkColor}
      />
    </div>
  )
}
