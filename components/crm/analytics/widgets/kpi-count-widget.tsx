import { AnalyticsKpiVisual } from "@/components/crm/analytics/widgets/analytics-kpi-visual"
import type { SparklinePoint } from "@/lib/analytics/sparkline"

type KpiCountWidgetProps = {
  widgetId: string
  value: number
  sparkline: SparklinePoint[]
}

export function KpiCountWidget({
  widgetId,
  value,
  sparkline,
}: KpiCountWidgetProps) {
  return (
    <AnalyticsKpiVisual
      widgetId={widgetId}
      value={value}
      sparkline={sparkline}
    />
  )
}
