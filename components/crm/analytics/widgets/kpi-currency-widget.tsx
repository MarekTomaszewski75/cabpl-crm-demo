import { AnalyticsKpiVisual } from "@/components/crm/analytics/widgets/analytics-kpi-visual"
import type { SparklinePoint } from "@/lib/analytics/sparkline"
import { formatCurrencyPln } from "@/lib/format/pl"

type KpiCurrencyWidgetProps = {
  widgetId: string
  value: number
  sparkline: SparklinePoint[]
}

export function KpiCurrencyWidget({
  widgetId,
  value,
  sparkline,
}: KpiCurrencyWidgetProps) {
  return (
    <AnalyticsKpiVisual
      widgetId={widgetId}
      value={formatCurrencyPln(value)}
      sparkline={sparkline}
    />
  )
}
