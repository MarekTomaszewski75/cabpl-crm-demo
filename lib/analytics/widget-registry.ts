import type {
  AnalyticsPanelPreset,
  AnalyticsWidgetDefinition,
} from "@/types/analytics"

export const ANALYTICS_WIDGETS: readonly AnalyticsWidgetDefinition[] = [
  {
    id: "new-leads",
    titlePl: "Nowe leady",
    domainTag: "leads",
    kind: "kpi_count",
    size: "1x1",
    metricKey: "new_leads_count",
  },
  {
    id: "won-deals",
    titlePl: "Wygrane deale",
    domainTag: "deals",
    kind: "kpi_count",
    size: "1x1",
    metricKey: "won_deals_count",
  },
  {
    id: "open-deals",
    titlePl: "Otwarte deale",
    domainTag: "deals",
    kind: "kpi_count",
    size: "1x1",
    metricKey: "open_deals_count",
  },
  {
    id: "overdue-tasks",
    titlePl: "Zadania po terminie",
    domainTag: "tasks",
    kind: "kpi_count",
    size: "1x1",
    metricKey: "overdue_tasks_count",
  },
  {
    id: "deal-funnel",
    titlePl: "Konwersja dealów",
    domainTag: "deals",
    kind: "funnel",
    size: "2x1",
    metricKey: "deal_funnel",
  },
  {
    id: "won-amount-by-source",
    titlePl: "Kwota wygranych dealów wg źródła",
    domainTag: "deals",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "won_amount_by_source",
    restrictedRoles: ["regional_manager"],
  },
  {
    id: "avg-deal-value",
    titlePl: "Średnia wartość deala",
    domainTag: "deals",
    kind: "kpi_currency",
    size: "1x1",
    metricKey: "avg_deal_value",
  },
  {
    id: "avg-deal-duration",
    titlePl: "Średni czas trwania deala",
    domainTag: "deals",
    kind: "kpi_duration",
    size: "1x1",
    metricKey: "avg_deal_duration_days",
    restrictedRoles: ["regional_manager", "advisor"],
  },
  {
    id: "overdue-tasks-by-owner",
    titlePl: "Zadania po terminie wg opiekuna",
    domainTag: "tasks",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "overdue_tasks_by_owner",
  },
  {
    id: "tasks-by-priority",
    titlePl: "Zadania wg priorytetu",
    domainTag: "tasks",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "tasks_by_priority",
  },
] as const

export const ANALYTICS_PANEL_PRESETS: readonly AnalyticsPanelPreset[] = [
  {
    id: "sales-pipeline",
    labelPl: "Sprzedaż i lejek",
    widgetIds: [
      "new-leads",
      "won-deals",
      "open-deals",
      "overdue-tasks",
      "deal-funnel",
      "won-amount-by-source",
      "avg-deal-value",
      "avg-deal-duration",
    ],
  },
  {
    id: "team-activity",
    labelPl: "Zespół i zadania",
    widgetIds: [
      "overdue-tasks",
      "overdue-tasks-by-owner",
      "tasks-by-priority",
      "open-deals",
      "won-deals",
      "avg-deal-value",
    ],
  },
] as const

const WIDGET_BY_ID = new Map(
  ANALYTICS_WIDGETS.map((widget) => [widget.id, widget]),
)

export function getAnalyticsWidgetById(
  id: string,
): AnalyticsWidgetDefinition | undefined {
  return WIDGET_BY_ID.get(id)
}

export function getAnalyticsPanelPreset(
  id: string,
): AnalyticsPanelPreset | undefined {
  return ANALYTICS_PANEL_PRESETS.find((preset) => preset.id === id)
}

export const DEFAULT_ANALYTICS_PANEL_PRESET_ID = ANALYTICS_PANEL_PRESETS[0].id
