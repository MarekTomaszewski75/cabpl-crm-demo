"use client"

import { AdvisorRadarWidget } from "@/components/crm/analytics/widgets/advisor-radar-widget"
import { AdvisorRankingTableWidget } from "@/components/crm/analytics/widgets/advisor-ranking-table-widget"
import { AdvisorWonAmountWidget } from "@/components/crm/analytics/widgets/advisor-won-amount-widget"
import { DealFunnelWidget } from "@/components/crm/analytics/widgets/deal-funnel-widget"
import { ForecastScenariosLineWidget } from "@/components/crm/analytics/widgets/forecast-scenarios-line-widget"
import { KpiCountWidget } from "@/components/crm/analytics/widgets/kpi-count-widget"
import { KpiCurrencyWidget } from "@/components/crm/analytics/widgets/kpi-currency-widget"
import { KpiDurationWidget } from "@/components/crm/analytics/widgets/kpi-duration-widget"
import { LeadConversionLineWidget } from "@/components/crm/analytics/widgets/lead-conversion-line-widget"
import { LeadsVsWonLineWidget } from "@/components/crm/analytics/widgets/leads-vs-won-line-widget"
import { OverdueTasksByOwnerWidget } from "@/components/crm/analytics/widgets/overdue-tasks-by-owner-widget"
import { PlanActualAreaWidget } from "@/components/crm/analytics/widgets/plan-actual-area-widget"
import { ProductCategoryWonWidget } from "@/components/crm/analytics/widgets/product-category-won-widget"
import { RegionPlanRadialWidget } from "@/components/crm/analytics/widgets/region-plan-radial-widget"
import { RegionRadarWidget } from "@/components/crm/analytics/widgets/region-radar-widget"
import { RegionRealizationBarWidget } from "@/components/crm/analytics/widgets/region-realization-bar-widget"
import { RegionScorecardTableWidget } from "@/components/crm/analytics/widgets/region-scorecard-table-widget"
import { SegmentSharePieWidget } from "@/components/crm/analytics/widgets/segment-share-pie-widget"
import { TasksByPriorityWidget } from "@/components/crm/analytics/widgets/tasks-by-priority-widget"
import { TeamActivityAreaWidget } from "@/components/crm/analytics/widgets/team-activity-area-widget"
import { TopOpenDealsTableWidget } from "@/components/crm/analytics/widgets/top-open-deals-table-widget"
import { WonAmountBySourceWidget } from "@/components/crm/analytics/widgets/won-amount-by-source-widget"
import {
  getAnalyticsMetric,
  type AdvisorRadarData,
  type AdvisorRankingRow,
  type AdvisorWonAmountRow,
  type DealFunnelRow,
  type ForecastScenariosTrendRow,
  type LeadConversionTrendRow,
  type LeadsVsWonTrendRow,
  type OverdueTasksByOwnerRow,
  type PlanActualTrendRow,
  type ProductCategoryWonRow,
  type RegionPlanRealization,
  type RegionRadarData,
  type RegionRealizationBarRow,
  type RegionScorecardRow,
  type SegmentShareRow,
  type TasksByPriorityRow,
  type TeamActivityTimelineRow,
  type TopOpenDealRow,
  type WonAmountBySourceRow,
} from "@/lib/analytics/metrics"
import { getMetricSparkline } from "@/lib/analytics/sparkline"
import type {
  AnalyticsGlobalFilters,
  AnalyticsWidgetDefinition,
} from "@/types/analytics"
import type {
  Client,
  Deal,
  DemoUser,
  KpiSnapshot,
  Lead,
  Meeting,
  Task,
} from "@/types/crm"

type WidgetRendererProps = {
  definition: AnalyticsWidgetDefinition
  filters: AnalyticsGlobalFilters
  user: DemoUser
  data: {
    leads: readonly Lead[]
    deals: readonly Deal[]
    tasks: readonly Task[]
    meetings?: readonly Meeting[]
    users: readonly DemoUser[]
    clients?: readonly Client[]
    kpi?: KpiSnapshot
  }
  onAdvisorSelect?: (ownerId: string) => void
  onRegionSelect?: (regionId: string) => void
  onSegmentSelect?: (segmentId: string) => void
}

export function WidgetRenderer({
  definition,
  filters,
  user,
  data,
  onAdvisorSelect,
  onRegionSelect,
  onSegmentSelect,
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
      if (definition.metricKey === "advisor_won_amount_rows") {
        return (
          <AdvisorWonAmountWidget
            rows={
              Array.isArray(metric) ? (metric as AdvisorWonAmountRow[]) : []
            }
          />
        )
      }
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
      if (definition.metricKey === "region_realization_bar_rows") {
        return (
          <RegionRealizationBarWidget
            rows={
              Array.isArray(metric) ? (metric as RegionRealizationBarRow[]) : []
            }
          />
        )
      }
      if (definition.metricKey === "product_category_won_rows") {
        return (
          <ProductCategoryWonWidget
            rows={
              Array.isArray(metric) ? (metric as ProductCategoryWonRow[]) : []
            }
          />
        )
      }
      return (
        <TasksByPriorityWidget
          rows={Array.isArray(metric) ? (metric as TasksByPriorityRow[]) : []}
        />
      )
    case "area_chart":
      if (definition.metricKey === "plan_actual_trend") {
        return (
          <PlanActualAreaWidget
            rows={Array.isArray(metric) ? (metric as PlanActualTrendRow[]) : []}
          />
        )
      }
      return (
        <TeamActivityAreaWidget
          rows={
            Array.isArray(metric) ? (metric as TeamActivityTimelineRow[]) : []
          }
        />
      )
    case "line_chart":
      if (definition.metricKey === "forecast_scenarios_trend") {
        return (
          <ForecastScenariosLineWidget
            rows={
              Array.isArray(metric)
                ? (metric as ForecastScenariosTrendRow[])
                : []
            }
          />
        )
      }
      if (definition.metricKey === "leads_vs_won_trend") {
        return (
          <LeadsVsWonLineWidget
            rows={Array.isArray(metric) ? (metric as LeadsVsWonTrendRow[]) : []}
          />
        )
      }
      return (
        <LeadConversionLineWidget
          rows={
            Array.isArray(metric) ? (metric as LeadConversionTrendRow[]) : []
          }
        />
      )
    case "pie_chart":
      return (
        <SegmentSharePieWidget
          rows={Array.isArray(metric) ? (metric as SegmentShareRow[]) : []}
          activeSegmentId={filters.segmentId}
          onSegmentSelect={onSegmentSelect}
        />
      )
    case "radar_chart":
      if (definition.metricKey === "region_radar_rows") {
        return (
          <RegionRadarWidget
            data={
              metric && !Array.isArray(metric)
                ? (metric as RegionRadarData)
                : { dimensions: [], series: [] }
            }
          />
        )
      }
      return (
        <AdvisorRadarWidget
          data={
            metric && !Array.isArray(metric)
              ? (metric as AdvisorRadarData)
              : { dimensions: [], series: [], teamAverageScores: [] }
          }
          filters={filters}
        />
      )
    case "table":
      if (definition.metricKey === "region_scorecard_rows") {
        return (
          <RegionScorecardTableWidget
            rows={Array.isArray(metric) ? (metric as RegionScorecardRow[]) : []}
            activeRegionId={filters.regionId}
            onRegionSelect={onRegionSelect}
          />
        )
      }
      if (definition.metricKey === "top_open_deals_rows") {
        return (
          <TopOpenDealsTableWidget
            rows={Array.isArray(metric) ? (metric as TopOpenDealRow[]) : []}
          />
        )
      }
      return (
        <AdvisorRankingTableWidget
          rows={Array.isArray(metric) ? (metric as AdvisorRankingRow[]) : []}
          onAdvisorSelect={onAdvisorSelect}
        />
      )
    case "radial_kpi":
      return (
        <RegionPlanRadialWidget
          data={
            metric && !Array.isArray(metric)
              ? (metric as RegionPlanRealization)
              : {
                  planPln: 0,
                  actualPln: 0,
                  realizationPercent: 0,
                  regionName: "",
                }
          }
        />
      )
    default:
      return null
  }
}
