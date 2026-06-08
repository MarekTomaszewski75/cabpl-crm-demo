import { AnalyticsKpiVisual } from "@/components/crm/analytics/widgets/analytics-kpi-visual"
import type { SparklinePoint } from "@/lib/analytics/sparkline"

type KpiDurationWidgetProps = {
  widgetId: string
  days: number
  sparkline: SparklinePoint[]
}

export function KpiDurationWidget({
  widgetId,
  days,
  sparkline,
}: KpiDurationWidgetProps) {
  return (
    <AnalyticsKpiVisual
      widgetId={widgetId}
      value={
        <>
          {days}{" "}
          <span className="text-lg font-medium text-muted-foreground">dni</span>
        </>
      }
      sparkline={sparkline}
    />
  )
}
