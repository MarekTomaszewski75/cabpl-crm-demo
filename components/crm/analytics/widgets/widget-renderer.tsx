"use client"

import { DealFunnelWidget } from "@/components/crm/analytics/widgets/deal-funnel-widget"
import { KpiCountWidget } from "@/components/crm/analytics/widgets/kpi-count-widget"
import { KpiCurrencyWidget } from "@/components/crm/analytics/widgets/kpi-currency-widget"
import { KpiDurationWidget } from "@/components/crm/analytics/widgets/kpi-duration-widget"
import { OverdueTasksByOwnerWidget } from "@/components/crm/analytics/widgets/overdue-tasks-by-owner-widget"
import { TasksByPriorityWidget } from "@/components/crm/analytics/widgets/tasks-by-priority-widget"
import { WonAmountBySourceWidget } from "@/components/crm/analytics/widgets/won-amount-by-source-widget"
import {
  getAnalyticsMetric,
  type DealFunnelRow,
  type OverdueTasksByOwnerRow,
  type TasksByPriorityRow,
  type WonAmountBySourceRow,
} from "@/lib/analytics/metrics"
import { getMetricSparkline } from "@/lib/analytics/sparkline"
import type {
  AnalyticsGlobalFilters,
  AnalyticsWidgetDefinition,
} from "@/types/analytics"
import type { Deal, DemoUser, Lead, Task } from "@/types/crm"

type WidgetRendererProps = {
  definition: AnalyticsWidgetDefinition
  filters: AnalyticsGlobalFilters
  user: DemoUser
  data: {
    leads: readonly Lead[]
    deals: readonly Deal[]
    tasks: readonly Task[]
    users: readonly DemoUser[]
  }
}

export function WidgetRenderer({
  definition,
  filters,
  user,
  data,
}: WidgetRendererProps) {
  const metric = getAnalyticsMetric(
    definition.metricKey,
    data,
    user,
    filters,
  )
  const sparkline = getMetricSparkline(
    definition.metricKey,
    data,
    user,
    filters,
  )

  switch (definition.kind) {
    case "kpi_count":
      return (
        <KpiCountWidget
          widgetId={definition.id}
          value={typeof metric === "number" ? metric : 0}
          sparkline={sparkline}
        />
      )
    case "kpi_currency":
      return (
        <KpiCurrencyWidget
          widgetId={definition.id}
          value={typeof metric === "number" ? metric : 0}
          sparkline={sparkline}
        />
      )
    case "kpi_duration":
      return (
        <KpiDurationWidget
          widgetId={definition.id}
          days={typeof metric === "number" ? metric : 0}
          sparkline={sparkline}
        />
      )
    case "funnel":
      return (
        <DealFunnelWidget
          rows={Array.isArray(metric) ? (metric as DealFunnelRow[]) : []}
        />
      )
    case "bar_chart":
    case "stacked_bar":
      if (definition.metricKey === "won_amount_by_source") {
        return (
          <WonAmountBySourceWidget
            rows={
              Array.isArray(metric) ? (metric as WonAmountBySourceRow[]) : []
            }
          />
        )
      }
      if (definition.metricKey === "overdue_tasks_by_owner") {
        return (
          <OverdueTasksByOwnerWidget
            rows={
              Array.isArray(metric)
                ? (metric as OverdueTasksByOwnerRow[])
                : []
            }
          />
        )
      }
      return (
        <TasksByPriorityWidget
          rows={Array.isArray(metric) ? (metric as TasksByPriorityRow[]) : []}
        />
      )
    default:
      return null
  }
}
