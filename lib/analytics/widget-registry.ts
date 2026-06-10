import { isWidgetAvailableForRole } from "@/lib/analytics/widget-access"
import type {
  AnalyticsPanelPreset,
  AnalyticsTimePeriod,
  AnalyticsWidgetDefinition,
} from "@/types/analytics"
import type { UserRole } from "@/types/crm"

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
    allowedRoles: ["executive"],
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
  },
  {
    id: "overdue-tasks-by-owner",
    titlePl: "Zadania po terminie wg opiekuna",
    domainTag: "tasks",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "overdue_tasks_by_owner",
    allowedRoles: ["regional_manager"],
  },
  {
    id: "tasks-by-priority",
    titlePl: "Zadania wg priorytetu",
    domainTag: "tasks",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "tasks_by_priority",
  },
  {
    id: "advisor-won-amount",
    titlePl: "Wyniki doradców — kwota wygranych",
    domainTag: "team",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "advisor_won_amount_rows",
    allowedRoles: ["regional_manager"],
  },
  {
    id: "team-activity-area",
    titlePl: "Aktywność zespołu w czasie",
    domainTag: "team",
    kind: "area_chart",
    size: "2x1",
    metricKey: "team_activity_timeline",
    allowedRoles: ["regional_manager"],
  },
  {
    id: "advisor-radar",
    titlePl: "Profil doradców",
    domainTag: "team",
    kind: "radar_chart",
    size: "2x2",
    metricKey: "advisor_radar_rows",
    allowedRoles: ["regional_manager"],
  },
  {
    id: "advisor-ranking",
    titlePl: "Ranking zespołu",
    domainTag: "team",
    kind: "table",
    size: "2x2",
    metricKey: "advisor_ranking_rows",
    allowedRoles: ["regional_manager"],
  },
  {
    id: "lead-conversion-line",
    titlePl: "Konwersja lead → deal",
    domainTag: "leads",
    kind: "line_chart",
    size: "2x1",
    metricKey: "lead_conversion_trend",
    allowedRoles: ["regional_manager"],
  },
  {
    id: "plan-actual-area",
    titlePl: "Plan vs realizacja vs forecast",
    domainTag: "plan",
    kind: "area_chart",
    size: "2x2",
    metricKey: "plan_actual_trend",
    allowedRoles: ["executive"],
  },
  {
    id: "region-realization-bar",
    titlePl: "Realizacja wg regionu",
    domainTag: "regions",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "region_realization_bar_rows",
    allowedRoles: ["executive"],
  },
  {
    id: "segment-share-pie",
    titlePl: "Udział segmentów w realizacji",
    domainTag: "plan",
    kind: "pie_chart",
    size: "1x2",
    metricKey: "segment_share_rows",
    allowedRoles: ["executive"],
  },
  {
    id: "forecast-scenarios-line",
    titlePl: "Scenariusze forecastu",
    domainTag: "plan",
    kind: "line_chart",
    size: "2x1",
    metricKey: "forecast_scenarios_trend",
    allowedRoles: ["executive"],
  },
  {
    id: "product-category-won",
    titlePl: "Portfel produktowy — wygrane wg kategorii",
    domainTag: "deals",
    kind: "bar_chart",
    size: "2x1",
    metricKey: "product_category_won_rows",
    allowedRoles: ["executive"],
  },
  {
    id: "region-radar",
    titlePl: "Macierz regionów",
    domainTag: "regions",
    kind: "radar_chart",
    size: "2x2",
    metricKey: "region_radar_rows",
    allowedRoles: ["executive"],
  },
  {
    id: "region-scorecard-table",
    titlePl: "Scorecard regionów",
    domainTag: "regions",
    kind: "table",
    size: "4x2",
    metricKey: "region_scorecard_rows",
    allowedRoles: ["executive"],
  },
  {
    id: "region-plan-radial",
    titlePl: "Realizacja planu regionu",
    domainTag: "regions",
    kind: "radial_kpi",
    size: "1x1",
    metricKey: "region_plan_realization",
    allowedRoles: ["executive"],
  },
  {
    id: "leads-vs-won-line",
    titlePl: "Nowe leady vs wygrane deale",
    domainTag: "leads",
    kind: "line_chart",
    size: "2x1",
    metricKey: "leads_vs_won_trend",
    allowedRoles: ["executive"],
  },
  {
    id: "top-open-deals-table",
    titlePl: "Top 10 otwartych dealów",
    domainTag: "deals",
    kind: "table",
    size: "4x2",
    metricKey: "top_open_deals_rows",
    allowedRoles: ["executive"],
  },
] as const

export const MANAGER_PANEL_PRESETS: readonly AnalyticsPanelPreset[] = [
  {
    id: "my-team",
    labelPl: "Mój zespół",
    widgetIds: [
      "advisor-won-amount",
      "deal-funnel",
      "team-activity-area",
      "advisor-radar",
      "overdue-tasks-by-owner",
      "lead-conversion-line",
      "advisor-ranking",
      "tasks-by-priority",
    ],
  },
  {
    id: "sales-pipeline",
    labelPl: "Sprzedaż i lejek",
    widgetIds: [
      "deal-funnel",
      "open-deals",
      "won-deals",
      "avg-deal-value",
      "avg-deal-duration",
      "lead-conversion-line",
    ],
  },
  {
    id: "team-activity",
    labelPl: "Aktywność operacyjna",
    widgetIds: [
      "overdue-tasks",
      "overdue-tasks-by-owner",
      "tasks-by-priority",
      "team-activity-area",
    ],
  },
] as const

export const EXECUTIVE_PANEL_PRESETS: readonly AnalyticsPanelPreset[] = [
  {
    id: "bank-portfolio",
    labelPl: "Portfel banku",
    widgetIds: [
      "plan-actual-area",
      "region-realization-bar",
      "segment-share-pie",
      "forecast-scenarios-line",
      "product-category-won",
      "deal-funnel",
      "region-radar",
      "region-scorecard-table",
      "won-amount-by-source",
      "leads-vs-won-line",
    ],
  },
  {
    id: "regions",
    labelPl: "Regiony",
    widgetIds: [
      "region-realization-bar",
      "region-radar",
      "region-scorecard-table",
      "region-plan-radial",
    ],
  },
  {
    id: "products-pipeline",
    labelPl: "Produkty i lejki",
    widgetIds: [
      "product-category-won",
      "deal-funnel",
      "won-amount-by-source",
      "avg-deal-value",
      "top-open-deals-table",
    ],
  },
] as const

/** @deprecated Użyj getAnalyticsPresetsForRole(role). */
export const ANALYTICS_PANEL_PRESETS: readonly AnalyticsPanelPreset[] = [
  ...MANAGER_PANEL_PRESETS,
  ...EXECUTIVE_PANEL_PRESETS,
] as const

const WIDGET_BY_ID = new Map(
  ANALYTICS_WIDGETS.map((widget) => [widget.id, widget]),
)

export function getAnalyticsPresetsForRole(
  role: UserRole,
): readonly AnalyticsPanelPreset[] {
  if (role === "executive") return EXECUTIVE_PANEL_PRESETS
  if (role === "regional_manager") return MANAGER_PANEL_PRESETS
  return []
}

export function getDefaultPresetForRole(role: UserRole): string {
  if (role === "executive") return "bank-portfolio"
  if (role === "regional_manager") return "my-team"
  return MANAGER_PANEL_PRESETS[0]?.id ?? "sales-pipeline"
}

export function getDefaultTimePeriodForRole(role: UserRole): AnalyticsTimePeriod {
  return role === "executive" ? "ytd" : "quarter"
}

export function getAnalyticsWidgetById(
  id: string,
): AnalyticsWidgetDefinition | undefined {
  return WIDGET_BY_ID.get(id)
}

export function getAnalyticsPanelPreset(
  id: string,
  role?: UserRole,
): AnalyticsPanelPreset | undefined {
  const presets = role
    ? getAnalyticsPresetsForRole(role)
    : ANALYTICS_PANEL_PRESETS
  return presets.find((preset) => preset.id === id)
}

export function getWidgetsForPreset(
  presetId: string,
  role: UserRole,
): string[] {
  const preset = getAnalyticsPanelPreset(presetId, role)
  if (!preset) return []
  return preset.widgetIds.filter((widgetId) => {
    const definition = getAnalyticsWidgetById(widgetId)
    return definition && isWidgetAvailableForRole(definition, role)
  })
}

export const DEFAULT_ANALYTICS_PANEL_PRESET_ID = MANAGER_PANEL_PRESETS[0].id
