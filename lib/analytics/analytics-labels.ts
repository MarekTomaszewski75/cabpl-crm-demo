import type { AnalyticsDomainTag, AnalyticsTimePeriod } from "@/types/analytics"

export const ANALYTICS_DOMAIN_LABELS: Record<AnalyticsDomainTag, string> = {
  leads: "Leady",
  deals: "Deale",
  tasks: "Zadania",
  plan: "Plan",
  team: "Zespół",
  regions: "Regiony",
}

export const ANALYTICS_TIME_PERIOD_LABELS: Record<AnalyticsTimePeriod, string> =
  {
    month: "Bieżący miesiąc",
    quarter: "Bieżący kwartał",
    ytd: "YTD",
  }

export const ANALYTICS_OWNER_ALL = "__all__"
export const ANALYTICS_REGION_ALL = "__all__"
export const ANALYTICS_SEGMENT_ALL = "__all__"
export const ANALYTICS_CATEGORY_ALL = "__all__"
