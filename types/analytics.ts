import type { UserRole } from "@/types/crm"

export type AnalyticsDomainTag =
  | "leads"
  | "deals"
  | "tasks"
  | "plan"
  | "team"
  | "regions"

export type AnalyticsWidgetKind =
  | "kpi_count"
  | "kpi_currency"
  | "kpi_duration"
  | "funnel"
  | "bar_chart"
  | "stacked_bar"
  | "area_chart"
  | "line_chart"
  | "pie_chart"
  | "radar_chart"
  | "table"
  | "radial_kpi"

export type AnalyticsWidgetSize = "1x1" | "2x1" | "1x2" | "2x2" | "4x2"

export type AnalyticsTimePeriod = "month" | "quarter" | "ytd"

export type AnalyticsGlobalFilters = {
  timePeriod: AnalyticsTimePeriod
  /** Pusta tablica = wszyscy opiekunowie w scope użytkownika. */
  ownerIds: string[]
  panelPresetId: string
  /** null = wszystkie regiony (tylko executive). */
  regionId: string | null
  /** null = wszystkie segmenty (tylko executive). */
  segmentId: string | null
  /** null = wszystkie kategorie produktowe (menedżer / zarząd). */
  pipelineCategoryId: string | null
}

export interface AnalyticsWidgetDefinition {
  id: string
  titlePl: string
  domainTag: AnalyticsDomainTag
  kind: AnalyticsWidgetKind
  size: AnalyticsWidgetSize
  metricKey: string
  /** Widżet dostępny tylko dla wymienionych ról. */
  allowedRoles?: UserRole[]
  /** @deprecated Preferuj allowedRoles + presety per rola. */
  restrictedRoles?: UserRole[]
}

export interface AnalyticsPanelPreset {
  id: string
  labelPl: string
  widgetIds: string[]
}
