import {
  EXECUTIVE_FILTER_ALL,
  getExecutiveChartRows,
  type ExecutiveDashboardFilters,
} from "@/lib/dashboard/executive-metrics"
import {
  DEAL_SOURCE_LABELS,
  DEAL_STATUS_LABELS,
  isTerminalDealStatus,
} from "@/lib/crm/deal-labels"
import { getPipelineCategoryLabel } from "@/lib/crm/deal-pipeline-labels"
import { TASK_PRIORITY_LABELS, TASK_PRIORITY_OPTIONS } from "@/lib/crm/task-labels"
import {
  DEMO_REFERENCE_DATE,
  getPeriodBounds,
  isBeforeReferenceDay,
  isDateInPeriod,
} from "@/lib/analytics/filters"
import { getSparklineBuckets } from "@/lib/analytics/sparkline"
import type { SparklinePoint } from "@/lib/analytics/sparkline"
import {
  applyPipelineCategoryFilter,
  filterAnalyticsEntities,
} from "@/lib/analytics/scope"
import { getPipelineSteps } from "@/lib/crm/deal-pipeline"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type {
  Client,
  Deal,
  DealSource,
  DealStatus,
  DemoUser,
  KpiSnapshot,
  Lead,
  Meeting,
  Task,
  TaskPriority,
} from "@/types/crm"

/** US-28: lejek analityczny per kategoria — tymczasowo lejek kredytowy. */
export const DEAL_FUNNEL_STAGES: readonly DealStatus[] = getPipelineSteps(
  "pcat-credit",
).filter((status) => status !== "lost") as readonly DealStatus[]

export type DealFunnelRow = {
  stage: DealStatus
  label: string
  count: number
}

export type WonAmountBySourceRow = {
  source: DealSource
  label: string
  amountPln: number
}

export type OverdueTasksByOwnerRow = {
  ownerId: string
  ownerName: string
  count: number
}

export type TasksByPriorityRow = {
  priority: TaskPriority
  label: string
  count: number
}

export type AdvisorWonAmountRow = {
  ownerId: string
  ownerName: string
  amountPln: number
  planPln: number
}

export type RegionScorecardRow = {
  regionId: string
  regionName: string
  planPln: number
  actualPln: number
  forecastPln: number
  realizationPercent: number
  gapPln: number
  openDealsCount: number
  openDealsAmountPln: number
  actualTrend: SparklinePoint[]
}

export type RegionRealizationBarRow = {
  regionId: string
  regionName: string
  planPln: number
  actualPln: number
}

export type PlanActualTrendRow = {
  label: string
  planPln: number
  actualPln: number
  forecastPln: number
}

export type ForecastScenariosTrendRow = {
  label: string
  forecastPln: number
  forecastOptimisticPln: number
  forecastPessimisticPln: number
}

export type LeadsVsWonTrendRow = {
  label: string
  leadsCount: number
  wonDealsCount: number
}

export type RegionRadarDimension = {
  key: string
  label: string
}

export type RegionRadarSeries = {
  regionId: string
  regionName: string
  scores: number[]
  rawCounts: number[]
}

export type RegionRadarData = {
  dimensions: RegionRadarDimension[]
  series: RegionRadarSeries[]
}

export type RegionPlanRealization = {
  planPln: number
  actualPln: number
  realizationPercent: number
  regionName: string
}

export type SegmentShareRow = {
  segmentId: string
  segmentName: string
  actualPln: number
  sharePercent: number
}

export type TeamActivityTimelineRow = {
  label: string
  leads: number
  dealsWon: number
  tasksDone: number
  meetings?: number
}

export type ProductCategoryWonRow = {
  pipelineCategoryId: string
  label: string
  amountPln: number
}

export type LeadConversionTrendRow = {
  label: string
  conversionPercent: number
}

export type AdvisorRankingRow = {
  ownerId: string
  ownerName: string
  wonAmountPln: number
  openDealsCount: number
  openDealsAmountPln: number
  newLeadsCount: number
  overdueTasksCount: number
  meetingsCount: number
  planRealizationPercent: number
  wonTrend: SparklinePoint[]
}

export type AdvisorRadarDimension = {
  key: string
  label: string
}

export type AdvisorRadarSeries = {
  ownerId: string
  ownerName: string
  scores: number[]
  rawCounts: number[]
}

export type AdvisorRadarData = {
  dimensions: AdvisorRadarDimension[]
  series: AdvisorRadarSeries[]
  teamAverageScores: number[]
}

export type TopOpenDealRow = {
  dealId: string
  title: string
  clientName: string
  ownerName: string
  regionId: string
  regionName: string
  amountPln: number
  status: DealStatus
  expectedCloseDate: string | null
}

type AnalyticsData = {
  leads: readonly Lead[]
  deals: readonly Deal[]
  tasks: readonly Task[]
  meetings?: readonly Meeting[]
  users: readonly DemoUser[]
  clients?: readonly Client[]
  kpi?: KpiSnapshot
}

const ADVISOR_RADAR_DIMENSIONS: readonly AdvisorRadarDimension[] = [
  { key: "leads", label: "Leady" },
  { key: "openDeals", label: "Otwarte deale" },
  { key: "wonDeals", label: "Wygrane" },
  { key: "tasksDone", label: "Zadania zamknięte" },
  { key: "meetings", label: "Spotkania" },
] as const

const REGION_RADAR_DIMENSIONS: readonly RegionRadarDimension[] = [
  { key: "realization", label: "Realizacja planu" },
  { key: "pipeline", label: "Pipeline" },
  { key: "conversion", label: "Konwersja" },
  { key: "activity", label: "Aktywność" },
  { key: "newLeads", label: "Nowi klienci" },
] as const

const DEMO_CURRENT_QUARTER = 2

function scopedMeetings(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
) {
  if (!data.meetings?.length) return []
  return filterAnalyticsEntities(data.meetings, user, filters)
}

function getRegionAdvisors(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): DemoUser[] {
  const regionId = user.regionId ?? filters.regionId ?? "mazowsze"
  return data.users.filter(
    (entry) => entry.role === "advisor" && entry.regionId === regionId,
  )
}

function isInDateRange(dateValue: string, start: Date, end: Date): boolean {
  const date = new Date(dateValue)
  return date >= start && date <= end
}

function getLastWeeklyBuckets(weekCount: number): {
  label: string
  start: Date
  end: Date
}[] {
  const end = DEMO_REFERENCE_DATE
  const buckets: { label: string; start: Date; end: Date }[] = []
  let cursorEnd = new Date(end)
  for (let week = weekCount; week >= 1; week -= 1) {
    const bucketStart = new Date(cursorEnd)
    bucketStart.setUTCDate(bucketStart.getUTCDate() - 6)
    bucketStart.setUTCHours(0, 0, 0, 0)
    buckets.unshift({
      label: `T${week}`,
      start: bucketStart,
      end: new Date(cursorEnd),
    })
    cursorEnd = new Date(bucketStart)
    cursorEnd.setUTCDate(cursorEnd.getUTCDate() - 1)
    cursorEnd.setUTCHours(23, 59, 59, 999)
  }
  return buckets
}

function normalizeScores(values: number[]): number[] {
  const max = Math.max(...values, 1)
  return values.map((value) => Math.round((value / max) * 100))
}

function getDealAmountPln(deal: Deal): number {
  return deal.amount ?? 0
}

/** Data zamknięcia deala — finishedAt, inaczej expectedCloseDate. */
function getDealClosedDate(deal: Deal): string | null {
  if (deal.finishedAt) return deal.finishedAt
  if (deal.expectedCloseDate) return deal.expectedCloseDate
  return null
}

function getUserDisplayName(
  users: readonly DemoUser[],
  ownerId: string,
): string {
  return users.find((user) => user.id === ownerId)?.displayName ?? ownerId
}

function toExecutiveDashboardFilters(
  filters: AnalyticsGlobalFilters,
): ExecutiveDashboardFilters {
  return {
    timePeriod: filters.timePeriod === "month" ? "ytd" : filters.timePeriod,
    regionId: filters.regionId ?? EXECUTIVE_FILTER_ALL,
    segmentId: filters.segmentId ?? EXECUTIVE_FILTER_ALL,
  }
}

function getRegionName(kpi: KpiSnapshot, regionId: string): string {
  return (
    kpi.byRegion.find((region) => region.regionId === regionId)?.regionName ??
    regionId
  )
}

function getClientName(
  data: AnalyticsData,
  clientId: string | null | undefined,
): string {
  if (!clientId || !data.clients?.length) return "—"
  return data.clients.find((client) => client.id === clientId)?.name ?? "—"
}

function getSegmentNameForFilter(
  data: AnalyticsData,
  segmentId: string | null,
): string | null {
  if (!segmentId || !data.kpi) return null
  return (
    data.kpi.bySegment.find((segment) => segment.segmentId === segmentId)
      ?.segmentName ?? null
  )
}

function getScopeContext(data: AnalyticsData) {
  return data.clients?.length ? { clients: data.clients } : undefined
}

function scopedLeads(data: AnalyticsData, user: DemoUser, filters: AnalyticsGlobalFilters) {
  return filterAnalyticsEntities(data.leads, user, filters, {
    ...getScopeContext(data),
    segmentNameForFilter: getSegmentNameForFilter(data, filters.segmentId),
    getClientId: (item) => (item as Lead).clientId,
  })
}

function scopedDeals(data: AnalyticsData, user: DemoUser, filters: AnalyticsGlobalFilters) {
  return applyPipelineCategoryFilter(
    filterAnalyticsEntities(data.deals, user, filters, {
      ...getScopeContext(data),
      segmentNameForFilter: getSegmentNameForFilter(data, filters.segmentId),
      getClientId: (item) => (item as Deal).clientId,
    }),
    filters.pipelineCategoryId,
  )
}

function scopedTasks(data: AnalyticsData, user: DemoUser, filters: AnalyticsGlobalFilters) {
  return filterAnalyticsEntities(data.tasks, user, filters)
}

/** Nowe leady — status `new`, filtr okresu po `createdAt`. */
export function getNewLeadsCount(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  return scopedLeads(data, user, filters).filter(
    (lead) =>
      lead.status === "new" &&
      isDateInPeriod(lead.createdAt, filters.timePeriod),
  ).length
}

/** Wygrane deale — filtr okresu po dacie zamknięcia lub `createdAt`. */
export function getWonDealsCount(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  return scopedDeals(data, user, filters).filter((deal) => {
    if (deal.status !== "won") return false
    const closedDate = getDealClosedDate(deal) ?? deal.createdAt
    return isDateInPeriod(closedDate, filters.timePeriod)
  }).length
}

/** Otwarte deale — nie `won`/`lost`; filtr okresu po `createdAt`. */
export function getOpenDealsCount(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  return scopedDeals(data, user, filters).filter(
    (deal) =>
      !isTerminalDealStatus(deal.status) &&
      isDateInPeriod(deal.createdAt, filters.timePeriod),
  ).length
}

/** Zadania po terminie — `dueDate` przed dniem referencyjnym, nie `completed`. */
export function getOverdueTasksCount(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  return scopedTasks(data, user, filters).filter(
    (task) =>
      !task.completed &&
      isBeforeReferenceDay(task.dueDate, DEMO_REFERENCE_DATE) &&
      isDateInPeriod(task.dueDate, filters.timePeriod),
  ).length
}

/** Lejek dealów — 6 etapów workflow + wygrany; snapshot bieżącego statusu w scope. */
export function getDealFunnel(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): DealFunnelRow[] {
  const deals = scopedDeals(data, user, filters).filter((deal) =>
    isDateInPeriod(deal.createdAt, filters.timePeriod),
  )

  return DEAL_FUNNEL_STAGES.map((stage) => ({
    stage,
    label: DEAL_STATUS_LABELS[stage],
    count: deals.filter((deal) => deal.status === stage).length,
  }))
}

/** Kwota wygranych dealów wg źródła — filtr okresu po dacie zamknięcia. */
export function getWonAmountBySource(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): WonAmountBySourceRow[] {
  const wonDeals = scopedDeals(data, user, filters).filter((deal) => {
    if (deal.status !== "won" || !deal.source) return false
    const closedDate = getDealClosedDate(deal) ?? deal.createdAt
    return isDateInPeriod(closedDate, filters.timePeriod)
  })

  const totals = new Map<DealSource, number>()
  for (const deal of wonDeals) {
    if (!deal.source) continue
    totals.set(deal.source, (totals.get(deal.source) ?? 0) + getDealAmountPln(deal))
  }

  return Array.from(totals.entries()).map(([source, amountPln]) => ({
    source,
    label: DEAL_SOURCE_LABELS[source],
    amountPln,
  }))
}

/** Średnia wartość deala — otwarte i wygrane w okresie (po `createdAt`). */
export function getAvgDealValue(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  const deals = scopedDeals(data, user, filters).filter(
    (deal) =>
      (deal.status === "won" || !isTerminalDealStatus(deal.status)) &&
      isDateInPeriod(deal.createdAt, filters.timePeriod),
  )
  if (deals.length === 0) return 0
  const total = deals.reduce((sum, deal) => sum + getDealAmountPln(deal), 0)
  return Math.round(total / deals.length)
}

/** Średni czas trwania deala w dniach — deale zamknięte w okresie. */
export function getAvgDealDurationDays(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  const closedDeals = scopedDeals(data, user, filters).filter((deal) => {
    if (!isTerminalDealStatus(deal.status)) return false
    const closedDate = getDealClosedDate(deal) ?? deal.createdAt
    return isDateInPeriod(closedDate, filters.timePeriod)
  })

  if (closedDeals.length === 0) return 0

  const totalDays = closedDeals.reduce((sum, deal) => {
    const closedDate = new Date(getDealClosedDate(deal) ?? deal.createdAt)
    const createdDate = new Date(deal.createdAt)
    const diffMs = closedDate.getTime() - createdDate.getTime()
    return sum + Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
  }, 0)

  return Math.round(totalDays / closedDeals.length)
}

/** Zadania po terminie wg opiekuna — filtr okresu po `dueDate`. */
export function getOverdueTasksByOwner(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): OverdueTasksByOwnerRow[] {
  const overdue = scopedTasks(data, user, filters).filter(
    (task) =>
      !task.completed &&
      isBeforeReferenceDay(task.dueDate, DEMO_REFERENCE_DATE) &&
      isDateInPeriod(task.dueDate, filters.timePeriod),
  )

  const counts = new Map<string, number>()
  for (const task of overdue) {
    counts.set(task.ownerId, (counts.get(task.ownerId) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([ownerId, count]) => ({
      ownerId,
      ownerName: getUserDisplayName(data.users, ownerId),
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

/** Zadania wg priorytetu — filtr okresu po `dueDate`, wszystkie nieukończone. */
export function getTasksByPriority(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): TasksByPriorityRow[] {
  const tasks = scopedTasks(data, user, filters).filter(
    (task) =>
      !task.completed && isDateInPeriod(task.dueDate, filters.timePeriod),
  )

  return TASK_PRIORITY_OPTIONS.map((priority) => ({
    priority,
    label: TASK_PRIORITY_LABELS[priority],
    count: tasks.filter((task) => task.priority === priority).length,
  }))
}

function pickKpiPeriodValues(
  row: {
    planPln: number
    actualPln: number
    forecastPln: number
    planQuarterPln: number
    actualQuarterPln: number
    forecastQuarterPln: number
  },
  timePeriod: AnalyticsGlobalFilters["timePeriod"],
) {
  if (timePeriod === "quarter") {
    return {
      planPln: row.planQuarterPln,
      actualPln: row.actualQuarterPln,
      forecastPln: row.forecastQuarterPln,
    }
  }
  return {
    planPln: row.planPln,
    actualPln: row.actualPln,
    forecastPln: row.forecastPln,
  }
}

export function computeRealizationPercent(
  actualPln: number,
  planPln: number,
): number {
  if (planPln <= 0) return 0
  return Math.min(100, Math.round((actualPln / planPln) * 100))
}

/** Suma kwot wygranych dealów w okresie. */
export function getWonDealsAmountPln(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  return scopedDeals(data, user, filters)
    .filter((deal) => {
      if (deal.status !== "won") return false
      const closedDate = getDealClosedDate(deal) ?? deal.createdAt
      return isDateInPeriod(closedDate, filters.timePeriod)
    })
    .reduce((sum, deal) => sum + getDealAmountPln(deal), 0)
}

/** Suma kwot otwartego pipeline (deale nie terminalne). */
export function getOpenPipelineAmountPln(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number {
  return scopedDeals(data, user, filters)
    .filter((deal) => !isTerminalDealStatus(deal.status))
    .reduce((sum, deal) => sum + getDealAmountPln(deal), 0)
}

/** Wygrane deale per doradca — z planem split równy z regionu. */
export function getAdvisorWonAmountRows(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
  kpi: KpiSnapshot,
): AdvisorWonAmountRow[] {
  const wonDeals = scopedDeals(data, user, filters).filter((deal) => {
    if (deal.status !== "won") return false
    const closedDate = getDealClosedDate(deal) ?? deal.createdAt
    return isDateInPeriod(closedDate, filters.timePeriod)
  })

  const regionId = user.regionId ?? filters.regionId ?? "mazowsze"
  const regionKpi = kpi.byRegion.find((row) => row.regionId === regionId)
  const { planPln } = regionKpi
    ? pickKpiPeriodValues(regionKpi, filters.timePeriod)
    : { planPln: 0 }

  const advisors = data.users
    .filter((entry) => entry.role === "advisor" && entry.regionId === regionId)
    .filter((advisor) =>
      filters.ownerIds.length === 0
        ? true
        : filters.ownerIds.includes(advisor.id),
    )
  const regionAdvisorCount = data.users.filter(
    (entry) => entry.role === "advisor" && entry.regionId === regionId,
  ).length
  const planPerAdvisor =
    regionAdvisorCount > 0 ? Math.round(planPln / regionAdvisorCount) : 0

  const totals = new Map<string, number>()
  for (const deal of wonDeals) {
    totals.set(deal.ownerId, (totals.get(deal.ownerId) ?? 0) + getDealAmountPln(deal))
  }

  return advisors.map((advisor) => ({
    ownerId: advisor.id,
    ownerName: advisor.displayName,
    amountPln: totals.get(advisor.id) ?? 0,
    planPln: planPerAdvisor,
  }))
}

/** Realizacja planu regionu menedżera. */
export function getRegionPlanRealization(
  kpi: KpiSnapshot,
  regionId: string,
  timePeriod: AnalyticsGlobalFilters["timePeriod"],
): { planPln: number; actualPln: number; realizationPercent: number } {
  const region = kpi.byRegion.find((row) => row.regionId === regionId)
  if (!region) {
    return { planPln: 0, actualPln: 0, realizationPercent: 0 }
  }
  const { planPln, actualPln } = pickKpiPeriodValues(region, timePeriod)
  return {
    planPln,
    actualPln,
    realizationPercent: computeRealizationPercent(actualPln, planPln),
  }
}

/** KPI bank-wide z opcjonalnym filtrem region/segment. */
export function getBankWideKpiTotals(
  kpi: KpiSnapshot,
  filters: Pick<AnalyticsGlobalFilters, "timePeriod" | "regionId" | "segmentId">,
): {
  planPln: number
  actualPln: number
  forecastPln: number
  realizationPercent: number
} {
  const { timePeriod, regionId, segmentId } = filters

  if (regionId && !segmentId) {
    const region = kpi.byRegion.find((row) => row.regionId === regionId)
    if (region) {
      const values = pickKpiPeriodValues(region, timePeriod)
      return {
        ...values,
        realizationPercent: computeRealizationPercent(
          values.actualPln,
          values.planPln,
        ),
      }
    }
  }

  if (segmentId && !regionId) {
    const segment = kpi.bySegment.find((row) => row.segmentId === segmentId)
    if (segment) {
      const values = pickKpiPeriodValues(segment, timePeriod)
      return {
        ...values,
        realizationPercent: computeRealizationPercent(
          values.actualPln,
          values.planPln,
        ),
      }
    }
  }

  const bank =
    timePeriod === "quarter"
      ? {
          planPln: kpi.planQuarterPln,
          actualPln: kpi.actualQuarterPln,
          forecastPln: kpi.forecastQuarterPln,
        }
      : {
          planPln: kpi.planYtdPln,
          actualPln: kpi.actualYtdPln,
          forecastPln: kpi.forecastYtdPln,
        }

  return {
    ...bank,
    realizationPercent: computeRealizationPercent(bank.actualPln, bank.planPln),
  }
}

function getRegionActualTrend(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
  regionId: string,
): SparklinePoint[] {
  const weeklyBuckets = getLastWeeklyBuckets(6)
  const regionFilters: AnalyticsGlobalFilters = {
    ...filters,
    timePeriod: "ytd",
    regionId,
  }
  const deals = scopedDeals(data, user, regionFilters)

  return weeklyBuckets.map((bucket) => ({
    label: bucket.label,
    value: deals
      .filter((deal) => {
        if (deal.status !== "won") return false
        const closedDate = getDealClosedDate(deal) ?? deal.createdAt
        return isInDateRange(closedDate, bucket.start, bucket.end)
      })
      .reduce((sum, deal) => sum + getDealAmountPln(deal), 0),
  }))
}

/** Scorecard regionów — join KPI + operacyjne deale. */
export function getRegionScorecardRows(
  data: AnalyticsData,
  user: DemoUser,
  kpi: KpiSnapshot,
  filters: AnalyticsGlobalFilters,
): RegionScorecardRow[] {
  return kpi.byRegion.map((region) => {
    const regionFilters = { ...filters, regionId: region.regionId }
    const openDeals = scopedDeals(data, user, regionFilters).filter(
      (deal) => !isTerminalDealStatus(deal.status),
    )
    const { planPln, actualPln, forecastPln } = pickKpiPeriodValues(
      region,
      filters.timePeriod,
    )
    return {
      regionId: region.regionId,
      regionName: region.regionName,
      planPln,
      actualPln,
      forecastPln,
      realizationPercent: computeRealizationPercent(actualPln, planPln),
      gapPln: planPln - actualPln,
      openDealsCount: openDeals.length,
      openDealsAmountPln: openDeals.reduce(
        (sum, deal) => sum + getDealAmountPln(deal),
        0,
      ),
      actualTrend: getRegionActualTrend(data, user, filters, region.regionId),
    }
  })
}

/** Słupki plan vs realizacja per region. */
export function getRegionRealizationBarRows(
  kpi: KpiSnapshot,
  filters: AnalyticsGlobalFilters,
): RegionRealizationBarRow[] {
  return kpi.byRegion.map((region) => {
    const { planPln, actualPln } = pickKpiPeriodValues(region, filters.timePeriod)
    return {
      regionId: region.regionId,
      regionName: region.regionName,
      planPln,
      actualPln,
    }
  })
}

/** Miesięczny trend planu, realizacji i forecastu banku. */
export function getPlanActualTrendRows(
  kpi: KpiSnapshot,
  filters: AnalyticsGlobalFilters,
): PlanActualTrendRow[] {
  const executiveFilters = toExecutiveDashboardFilters(filters)
  const rows = getExecutiveChartRows(kpi, executiveFilters)
  if (filters.timePeriod === "month") {
    const last = rows.at(-1)
    return last
      ? [
          {
            label: last.label,
            planPln: last.planPln,
            actualPln: last.actualPln,
            forecastPln: last.forecastPln,
          },
        ]
      : []
  }
  if (filters.timePeriod === "quarter") {
    return rows
      .filter((row) => {
        const month = kpi.monthlyTrend.find(
          (entry) => entry.monthLabel === row.label,
        )
        return month?.quarter === DEMO_CURRENT_QUARTER
      })
      .map((row) => ({
        label: row.label,
        planPln: row.planPln,
        actualPln: row.actualPln,
        forecastPln: row.forecastPln,
      }))
  }
  return rows.map((row) => ({
    label: row.label,
    planPln: row.planPln,
    actualPln: row.actualPln,
    forecastPln: row.forecastPln,
  }))
}

/** Miesięczne scenariusze forecastu. */
export function getForecastScenariosTrendRows(
  kpi: KpiSnapshot,
  filters: AnalyticsGlobalFilters,
): ForecastScenariosTrendRow[] {
  const executiveFilters = toExecutiveDashboardFilters(filters)
  const rows = getExecutiveChartRows(kpi, executiveFilters)
  const mapRow = (row: (typeof rows)[number]): ForecastScenariosTrendRow => ({
    label: row.label,
    forecastPln: row.forecastPln,
    forecastOptimisticPln: row.forecastOptimisticPln,
    forecastPessimisticPln: row.forecastPessimisticPln,
  })

  if (filters.timePeriod === "month") {
    const last = rows.at(-1)
    return last ? [mapRow(last)] : []
  }
  if (filters.timePeriod === "quarter") {
    return rows
      .filter((row) => {
        const month = kpi.monthlyTrend.find(
          (entry) => entry.monthLabel === row.label,
        )
        return month?.quarter === DEMO_CURRENT_QUARTER
      })
      .map(mapRow)
  }
  return rows.map(mapRow)
}

/** Macierz regionów — znormalizowane wymiary 0–100. */
export function getRegionRadarRows(
  data: AnalyticsData,
  user: DemoUser,
  kpi: KpiSnapshot,
  filters: AnalyticsGlobalFilters,
): RegionRadarData {
  const rawByRegion = kpi.byRegion.map((region) => {
    const regionFilters = { ...filters, regionId: region.regionId }
    const leads = scopedLeads(data, user, regionFilters)
    const deals = scopedDeals(data, user, regionFilters)
    const tasks = scopedTasks(data, user, regionFilters)
    const meetings = scopedMeetings(data, user, regionFilters)
    const { planPln, actualPln } = pickKpiPeriodValues(region, filters.timePeriod)
    const openPipeline = deals
      .filter((deal) => !isTerminalDealStatus(deal.status))
      .reduce((sum, deal) => sum + getDealAmountPln(deal), 0)
    const closedLeads = leads.filter(
      (lead) => lead.status === "won" || lead.status === "lost",
    )
    const wonLeads = closedLeads.filter((lead) => lead.status === "won").length
    const conversionPercent =
      closedLeads.length > 0
        ? Math.round((wonLeads / closedLeads.length) * 100)
        : 0
    const activityCount =
      tasks.filter(
        (task) =>
          task.completed && isDateInPeriod(task.dueDate, filters.timePeriod),
      ).length +
      meetings.filter((meeting) =>
        isDateInPeriod(meeting.startsAt, filters.timePeriod),
      ).length
    const newLeads = leads.filter(
      (lead) =>
        lead.status === "new" &&
        isDateInPeriod(lead.createdAt, filters.timePeriod),
    ).length

    const rawCounts = [
      computeRealizationPercent(actualPln, planPln),
      openPipeline,
      conversionPercent,
      activityCount,
      newLeads,
    ]

    return {
      regionId: region.regionId,
      regionName: region.regionName,
      rawCounts,
    }
  })

  const dimensionMax = REGION_RADAR_DIMENSIONS.map((_, index) =>
    Math.max(...rawByRegion.map((entry) => entry.rawCounts[index] ?? 0), 1),
  )

  const series: RegionRadarSeries[] = rawByRegion.map((entry) => ({
    regionId: entry.regionId,
    regionName: entry.regionName,
    rawCounts: entry.rawCounts,
    scores: entry.rawCounts.map((value, index) =>
      Math.round((value / dimensionMax[index]) * 100),
    ),
  }))

  return {
    dimensions: [...REGION_RADAR_DIMENSIONS],
    series,
  }
}

/** Realizacja planu dla widżetu radial — region z filtra lub bank-wide. */
export function getRegionPlanRadialData(
  kpi: KpiSnapshot,
  filters: AnalyticsGlobalFilters,
): RegionPlanRealization {
  if (filters.regionId) {
    const region = kpi.byRegion.find((row) => row.regionId === filters.regionId)
    if (region) {
      const { planPln, actualPln } = pickKpiPeriodValues(
        region,
        filters.timePeriod,
      )
      return {
        planPln,
        actualPln,
        realizationPercent: computeRealizationPercent(actualPln, planPln),
        regionName: region.regionName,
      }
    }
  }

  const totals = getBankWideKpiTotals(kpi, filters)
  return {
    planPln: totals.planPln,
    actualPln: totals.actualPln,
    realizationPercent: totals.realizationPercent,
    regionName: "Cały bank",
  }
}

/** Wygrane deale wg kategorii produktowej. */
export function getProductCategoryWonRows(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): ProductCategoryWonRow[] {
  const wonDeals = scopedDeals(data, user, filters).filter((deal) => {
    if (deal.status !== "won") return false
    const closedDate = getDealClosedDate(deal) ?? deal.createdAt
    return isDateInPeriod(closedDate, filters.timePeriod)
  })

  const totals = new Map<string, number>()
  for (const deal of wonDeals) {
    const categoryId = deal.pipelineCategoryId ?? "pcat-credit"
    totals.set(
      categoryId,
      (totals.get(categoryId) ?? 0) + getDealAmountPln(deal),
    )
  }

  return Array.from(totals.entries())
    .map(([pipelineCategoryId, amountPln]) => ({
      pipelineCategoryId,
      label: getPipelineCategoryLabel(pipelineCategoryId),
      amountPln,
    }))
    .sort((a, b) => b.amountPln - a.amountPln)
    .filter((row) => row.amountPln > 0)
}

/** Trend miesięczny: nowe leady vs wygrane deale. */
export function getLeadsVsWonTrendRows(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
  kpi: KpiSnapshot,
): LeadsVsWonTrendRow[] {
  const months =
    filters.timePeriod === "quarter"
      ? kpi.monthlyTrend.filter((row) => row.quarter === DEMO_CURRENT_QUARTER)
      : filters.timePeriod === "month"
        ? kpi.monthlyTrend.slice(-1)
        : kpi.monthlyTrend

  const leads = scopedLeads(data, user, filters)
  const deals = scopedDeals(data, user, filters)

  return months.map((month) => {
    const monthIndex = kpi.monthlyTrend.indexOf(month)
    const monthStart = new Date(Date.UTC(2026, monthIndex, 1))
    const monthEnd = new Date(
      Date.UTC(2026, monthIndex + 1, 0, 23, 59, 59, 999),
    )

    return {
      label: month.monthLabel,
      leadsCount: leads.filter(
        (lead) =>
          lead.status === "new" &&
          isInDateRange(lead.createdAt, monthStart, monthEnd),
      ).length,
      wonDealsCount: deals.filter((deal) => {
        if (deal.status !== "won") return false
        const closedDate = getDealClosedDate(deal) ?? deal.createdAt
        return isInDateRange(closedDate, monthStart, monthEnd)
      }).length,
    }
  })
}

/** Udział segmentów w realizacji. */
export function getSegmentShareRows(
  kpi: KpiSnapshot,
  timePeriod: AnalyticsGlobalFilters["timePeriod"],
): SegmentShareRow[] {
  const totalActual = kpi.bySegment.reduce((sum, segment) => {
    const { actualPln } = pickKpiPeriodValues(segment, timePeriod)
    return sum + actualPln
  }, 0)

  return kpi.bySegment.map((segment) => {
    const { actualPln } = pickKpiPeriodValues(segment, timePeriod)
    return {
      segmentId: segment.segmentId,
      segmentName: segment.segmentName,
      actualPln,
      sharePercent:
        totalActual > 0 ? Math.round((actualPln / totalActual) * 100) : 0,
    }
  })
}

/** Top N otwartych dealów po kwocie. */
/** Tygodniowy timeline aktywności zespołu w wybranym okresie. */
export function getTeamActivityTimeline(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): TeamActivityTimelineRow[] {
  const buckets = getSparklineBuckets(filters.timePeriod)
  const leads = scopedLeads(data, user, filters)
  const deals = scopedDeals(data, user, filters)
  const tasks = scopedTasks(data, user, filters)
  const meetings = scopedMeetings(data, user, filters)

  return buckets.map((bucket) => ({
    label: bucket.label,
    leads: leads.filter(
      (lead) =>
        lead.status === "new" && isInDateRange(lead.createdAt, bucket.start, bucket.end),
    ).length,
    dealsWon: deals.filter((deal) => {
      if (deal.status !== "won") return false
      const closedDate = getDealClosedDate(deal) ?? deal.createdAt
      return isInDateRange(closedDate, bucket.start, bucket.end)
    }).length,
    tasksDone: tasks.filter(
      (task) =>
        task.completed && isInDateRange(task.dueDate, bucket.start, bucket.end),
    ).length,
    meetings: meetings.filter((meeting) =>
      isInDateRange(meeting.startsAt, bucket.start, bucket.end),
    ).length,
  }))
}

/** Znormalizowany profil doradców (0–100) na wymiarach operacyjnych. */
export function getAdvisorRadarRows(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): AdvisorRadarData {
  const leads = scopedLeads(data, user, filters)
  const deals = scopedDeals(data, user, filters)
  const tasks = scopedTasks(data, user, filters)
  const meetings = scopedMeetings(data, user, filters)
  const advisors = getRegionAdvisors(data, user, filters).filter((advisor) =>
    filters.ownerIds.length === 0
      ? true
      : filters.ownerIds.includes(advisor.id),
  )

  const { start, end } = getPeriodBounds(filters.timePeriod)

  const rawByAdvisor = advisors.map((advisor) => {
    const advisorLeads = leads.filter(
      (lead) =>
        lead.ownerId === advisor.id &&
        isDateInPeriod(lead.createdAt, filters.timePeriod),
    )
    const advisorDeals = deals.filter((deal) => deal.ownerId === advisor.id)
    const advisorTasks = tasks.filter((task) => task.ownerId === advisor.id)
    const advisorMeetings = meetings.filter(
      (meeting) =>
        meeting.ownerId === advisor.id &&
        isInDateRange(meeting.startsAt, start, end),
    )

    const rawCounts = [
      advisorLeads.length,
      advisorDeals.filter((deal) => !isTerminalDealStatus(deal.status)).length,
      advisorDeals.filter((deal) => {
        if (deal.status !== "won") return false
        const closedDate = getDealClosedDate(deal) ?? deal.createdAt
        return isDateInPeriod(closedDate, filters.timePeriod)
      }).length,
      advisorTasks.filter(
        (task) =>
          task.completed && isDateInPeriod(task.dueDate, filters.timePeriod),
      ).length,
      advisorMeetings.length,
    ]

    return {
      ownerId: advisor.id,
      ownerName: advisor.displayName,
      rawCounts,
    }
  })

  const dimensionMax = ADVISOR_RADAR_DIMENSIONS.map((_, index) =>
    Math.max(...rawByAdvisor.map((entry) => entry.rawCounts[index] ?? 0), 1),
  )

  const series: AdvisorRadarSeries[] = rawByAdvisor.map((entry) => ({
    ownerId: entry.ownerId,
    ownerName: entry.ownerName,
    rawCounts: entry.rawCounts,
    scores: entry.rawCounts.map((value, index) =>
      Math.round((value / dimensionMax[index]) * 100),
    ),
  }))

  const teamTotals = ADVISOR_RADAR_DIMENSIONS.map((_, index) => {
    const sum = rawByAdvisor.reduce(
      (total, entry) => total + (entry.rawCounts[index] ?? 0),
      0,
    )
    return advisors.length > 0 ? Math.round(sum / advisors.length) : 0
  })

  return {
    dimensions: [...ADVISOR_RADAR_DIMENSIONS],
    series,
    teamAverageScores: normalizeScores(teamTotals),
  }
}

/** Ranking doradców w regionie menedżera. */
export function getAdvisorRankingRows(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
  kpi: KpiSnapshot,
): AdvisorRankingRow[] {
  const leads = scopedLeads(data, user, filters)
  const deals = scopedDeals(data, user, filters)
  const tasks = scopedTasks(data, user, filters)
  const meetings = scopedMeetings(data, user, filters)
  const advisors = getRegionAdvisors(data, user, filters)
  const regionId = user.regionId ?? filters.regionId ?? "mazowsze"
  const regionKpi = kpi.byRegion.find((row) => row.regionId === regionId)
  const { planPln } = regionKpi
    ? pickKpiPeriodValues(regionKpi, filters.timePeriod)
    : { planPln: 0 }
  const planPerAdvisor =
    advisors.length > 0 ? Math.round(planPln / advisors.length) : 0
  const weeklyBuckets = getLastWeeklyBuckets(6)

  return advisors
    .map((advisor) => {
      const wonDeals = deals.filter((deal) => {
        if (deal.ownerId !== advisor.id || deal.status !== "won") return false
        const closedDate = getDealClosedDate(deal) ?? deal.createdAt
        return isDateInPeriod(closedDate, filters.timePeriod)
      })
      const wonAmountPln = wonDeals.reduce(
        (sum, deal) => sum + getDealAmountPln(deal),
        0,
      )
      const openDeals = deals.filter(
        (deal) =>
          deal.ownerId === advisor.id && !isTerminalDealStatus(deal.status),
      )
      const overdueTasks = tasks.filter(
        (task) =>
          task.ownerId === advisor.id &&
          !task.completed &&
          isBeforeReferenceDay(task.dueDate, DEMO_REFERENCE_DATE) &&
          isDateInPeriod(task.dueDate, filters.timePeriod),
      )
      const advisorMeetings = meetings.filter((meeting) => {
        if (meeting.ownerId !== advisor.id) return false
        return isDateInPeriod(meeting.startsAt, filters.timePeriod)
      })
      const wonTrend = weeklyBuckets.map((bucket) => ({
        label: bucket.label,
        value: deals
          .filter((deal) => {
            if (deal.ownerId !== advisor.id || deal.status !== "won") {
              return false
            }
            const closedDate = getDealClosedDate(deal) ?? deal.createdAt
            return isInDateRange(closedDate, bucket.start, bucket.end)
          })
          .reduce((sum, deal) => sum + getDealAmountPln(deal), 0),
      }))

      return {
        ownerId: advisor.id,
        ownerName: advisor.displayName,
        wonAmountPln,
        openDealsCount: openDeals.length,
        openDealsAmountPln: openDeals.reduce(
          (sum, deal) => sum + getDealAmountPln(deal),
          0,
        ),
        newLeadsCount: leads.filter(
          (lead) =>
            lead.ownerId === advisor.id &&
            lead.status === "new" &&
            isDateInPeriod(lead.createdAt, filters.timePeriod),
        ).length,
        overdueTasksCount: overdueTasks.length,
        meetingsCount: advisorMeetings.length,
        planRealizationPercent: computeRealizationPercent(
          wonAmountPln,
          planPerAdvisor,
        ),
        wonTrend,
      }
    })
    .sort((a, b) => b.wonAmountPln - a.wonAmountPln)
}

/** Trend konwersji lead → deal (% won wśród zamkniętych leadów). */
export function getLeadConversionTrend(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): LeadConversionTrendRow[] {
  const buckets = getSparklineBuckets(filters.timePeriod)
  const leads = scopedLeads(data, user, filters)

  return buckets.map((bucket) => {
    const closed = leads.filter(
      (lead) =>
        (lead.status === "won" || lead.status === "lost") &&
        isInDateRange(lead.createdAt, bucket.start, bucket.end),
    )
    const won = closed.filter((lead) => lead.status === "won").length
    return {
      label: bucket.label,
      conversionPercent:
        closed.length > 0 ? Math.round((won / closed.length) * 100) : 0,
    }
  })
}

export function getTopOpenDealsRows(
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
  kpi: KpiSnapshot,
  limit = 10,
): TopOpenDealRow[] {
  return scopedDeals(data, user, filters)
    .filter((deal) => !isTerminalDealStatus(deal.status))
    .sort((a, b) => getDealAmountPln(b) - getDealAmountPln(a))
    .slice(0, limit)
    .map((deal) => ({
      dealId: deal.id,
      title: deal.name,
      clientName: getClientName(data, deal.clientId),
      ownerName: getUserDisplayName(data.users, deal.ownerId),
      regionId: deal.regionId,
      regionName: getRegionName(kpi, deal.regionId),
      amountPln: getDealAmountPln(deal),
      status: deal.status,
      expectedCloseDate: deal.expectedCloseDate ?? null,
    }))
}

export function getAnalyticsMetric(
  metricKey: string,
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
):
  | number
  | DealFunnelRow[]
  | WonAmountBySourceRow[]
  | OverdueTasksByOwnerRow[]
  | TasksByPriorityRow[]
  | AdvisorWonAmountRow[]
  | TeamActivityTimelineRow[]
  | AdvisorRadarData
  | AdvisorRankingRow[]
  | LeadConversionTrendRow[]
  | RegionScorecardRow[]
  | RegionRealizationBarRow[]
  | PlanActualTrendRow[]
  | ForecastScenariosTrendRow[]
  | SegmentShareRow[]
  | RegionRadarData
  | RegionPlanRealization
  | ProductCategoryWonRow[]
  | LeadsVsWonTrendRow[]
  | TopOpenDealRow[] {
  switch (metricKey) {
    case "new_leads_count":
      return getNewLeadsCount(data, user, filters)
    case "won_deals_count":
      return getWonDealsCount(data, user, filters)
    case "open_deals_count":
      return getOpenDealsCount(data, user, filters)
    case "overdue_tasks_count":
      return getOverdueTasksCount(data, user, filters)
    case "deal_funnel":
      return getDealFunnel(data, user, filters)
    case "won_amount_by_source":
      return getWonAmountBySource(data, user, filters)
    case "avg_deal_value":
      return getAvgDealValue(data, user, filters)
    case "avg_deal_duration_days":
      return getAvgDealDurationDays(data, user, filters)
    case "overdue_tasks_by_owner":
      return getOverdueTasksByOwner(data, user, filters)
    case "tasks_by_priority":
      return getTasksByPriority(data, user, filters)
    case "advisor_won_amount_rows":
      return data.kpi
        ? getAdvisorWonAmountRows(data, user, filters, data.kpi)
        : []
    case "team_activity_timeline":
      return getTeamActivityTimeline(data, user, filters)
    case "advisor_radar_rows":
      return getAdvisorRadarRows(data, user, filters)
    case "advisor_ranking_rows":
      return data.kpi
        ? getAdvisorRankingRows(data, user, filters, data.kpi)
        : []
    case "lead_conversion_trend":
      return getLeadConversionTrend(data, user, filters)
    case "plan_actual_trend":
      return data.kpi ? getPlanActualTrendRows(data.kpi, filters) : []
    case "region_realization_bar_rows":
      return data.kpi ? getRegionRealizationBarRows(data.kpi, filters) : []
    case "segment_share_rows":
      return data.kpi ? getSegmentShareRows(data.kpi, filters.timePeriod) : []
    case "forecast_scenarios_trend":
      return data.kpi ? getForecastScenariosTrendRows(data.kpi, filters) : []
    case "region_radar_rows":
      return data.kpi
        ? getRegionRadarRows(data, user, data.kpi, filters)
        : { dimensions: [], series: [] }
    case "region_scorecard_rows":
      return data.kpi
        ? getRegionScorecardRows(data, user, data.kpi, filters)
        : []
    case "region_plan_realization":
      return data.kpi
        ? getRegionPlanRadialData(data.kpi, filters)
        : { planPln: 0, actualPln: 0, realizationPercent: 0, regionName: "" }
    case "product_category_won_rows":
      return getProductCategoryWonRows(data, user, filters)
    case "leads_vs_won_trend":
      return data.kpi
        ? getLeadsVsWonTrendRows(data, user, filters, data.kpi)
        : []
    case "top_open_deals_rows":
      return data.kpi
        ? getTopOpenDealsRows(data, user, filters, data.kpi)
        : []
    default:
      return 0
  }
}
