import type { UserRole } from "@/types/crm"

export type AnalyticsDomainTag = "leads" | "deals" | "tasks" | "plan"

export type AnalyticsWidgetKind =
  | "kpi_count"
  | "kpi_currency"
  | "kpi_duration"
  | "funnel"
  | "bar_chart"
  | "stacked_bar"

export type AnalyticsWidgetSize = "1x1" | "2x1" | "1x2" | "2x2"

export type AnalyticsTimePeriod = "month" | "quarter" | "ytd"

export type AnalyticsGlobalFilters = {
  timePeriod: AnalyticsTimePeriod
  /** Pusta tablica = wszyscy opiekunowie w scope użytkownika. */
  ownerIds: string[]
  panelPresetId: string
}

export interface AnalyticsWidgetDefinition {
  id: string
  titlePl: string
  domainTag: AnalyticsDomainTag
  kind: AnalyticsWidgetKind
  size: AnalyticsWidgetSize
  metricKey: string
  /** Role bez dostępu do metryki — widżet pokazuje overlay. */
  restrictedRoles?: UserRole[]
}

export interface AnalyticsPanelPreset {
  id: string
  labelPl: string
  widgetIds: string[]
}
