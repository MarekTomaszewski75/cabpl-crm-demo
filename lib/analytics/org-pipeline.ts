import { getCurrentQuarter, getDemoReferenceDate } from "@/lib/analytics/filters"
import { isTerminalDealStatus } from "@/lib/crm/deal-pipeline"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  Deal,
  DealStatus,
  DemoUser,
  KpiPlanSeed,
  SalesOrgLevel,
  SalesOrgUnit,
} from "@/types/crm"

/** Horyzont prognozy: do końca bieżącego kwartału albo roku. */
export type ForecastHorizon = "quarter" | "year"

export type OrgPipelineFilters = {
  horizon: ForecastHorizon
  /** Nazwa segmentu (`Client.segment`), null = wszystkie. */
  segmentName: string | null
  pipelineCategoryId: string | null
  /** Etap otwartych szans w wybranym lejku; nie wpływa na wygrane. */
  status: DealStatus | null
}

export type OrgPipelineMetrics = {
  openCount: number
  /** Nominalna wartość otwartych szans. */
  pipelinePln: number
  /** Kwota × prawdopodobieństwo. */
  weightedPipelinePln: number
  wonPln: number
  planPln: number
  /** Wygrane + ważony lejek z zamknięciem do końca horyzontu (także przeterminowane). */
  forecastWeightedPln: number
  /** Wygrane + pełna wartość tego samego lejka (scenariusz „wszystko się zamknie”). */
  forecastUnweightedPln: number
}

export type OrgPipelineNode = OrgPipelineMetrics & {
  id: string
  name: string
  level: SalesOrgLevel | "rm"
  children: OrgPipelineNode[]
}

const EMPTY_METRICS: OrgPipelineMetrics = {
  openCount: 0,
  pipelinePln: 0,
  weightedPipelinePln: 0,
  wonPln: 0,
  planPln: 0,
  forecastWeightedPln: 0,
  forecastUnweightedPln: 0,
}

function sumMetrics(items: readonly OrgPipelineMetrics[]): OrgPipelineMetrics {
  return items.reduce<OrgPipelineMetrics>(
    (total, item) => ({
      openCount: total.openCount + item.openCount,
      pipelinePln: total.pipelinePln + item.pipelinePln,
      weightedPipelinePln: total.weightedPipelinePln + item.weightedPipelinePln,
      wonPln: total.wonPln + item.wonPln,
      planPln: total.planPln + item.planPln,
      forecastWeightedPln: total.forecastWeightedPln + item.forecastWeightedPln,
      forecastUnweightedPln:
        total.forecastUnweightedPln + item.forecastUnweightedPln,
    }),
    EMPTY_METRICS,
  )
}

function getHorizonBounds(horizon: ForecastHorizon, referenceDate: Date) {
  const year = referenceDate.getUTCFullYear()
  if (horizon === "year") {
    return {
      start: new Date(Date.UTC(year, 0, 1)),
      end: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
    }
  }
  const startMonth = (getCurrentQuarter(referenceDate) - 1) * 3
  return {
    start: new Date(Date.UTC(year, startMonth, 1)),
    end: new Date(Date.UTC(year, startMonth + 3, 0, 23, 59, 59, 999)),
  }
}

/** Udział planu wybranego segmentu / kategorii i horyzontu w planie rocznym banku. */
function getPlanShare(
  plan: KpiPlanSeed,
  filters: OrgPipelineFilters,
  referenceDate: Date,
): number {
  const annual = plan.monthlyPlan.reduce((sum, row) => sum + row.planPln, 0)
  if (annual <= 0) return 0
  let share = 1
  if (filters.horizon === "quarter") {
    const quarter = getCurrentQuarter(referenceDate)
    share *=
      plan.monthlyPlan
        .filter((row) => row.quarter === quarter)
        .reduce((sum, row) => sum + row.planPln, 0) / annual
  }
  if (filters.segmentName) {
    const segment = plan.bySegment.find(
      (row) => row.segmentName === filters.segmentName,
    )
    share *= segment ? segment.planPln / annual : 0
  }
  if (filters.pipelineCategoryId) {
    const category = plan.byCategory.find(
      (row) => row.pipelineCategoryId === filters.pipelineCategoryId,
    )
    share *= category ? category.planPln / annual : 0
  }
  return share
}

function computeRmMetrics(
  deals: readonly Deal[],
  planPln: number,
  filters: OrgPipelineFilters,
  bounds: { start: Date; end: Date },
  now: Date,
): OrgPipelineMetrics {
  let openCount = 0
  let pipelinePln = 0
  let weightedPipelinePln = 0
  let wonPln = 0
  let horizonPipelinePln = 0
  let horizonWeightedPln = 0

  for (const deal of deals) {
    const amount = deal.amount ?? 0
    if (deal.status === "won") {
      if (!deal.finishedAt) continue
      const finishedAt = new Date(deal.finishedAt)
      if (finishedAt >= bounds.start && finishedAt <= now) wonPln += amount
      continue
    }
    if (isTerminalDealStatus(deal.status)) continue
    if (filters.status && deal.status !== filters.status) continue

    const weighted = (amount * (deal.probability ?? 0)) / 100
    openCount += 1
    pipelinePln += amount
    weightedPipelinePln += weighted
    if (deal.expectedCloseDate && new Date(deal.expectedCloseDate) <= bounds.end) {
      horizonPipelinePln += amount
      horizonWeightedPln += weighted
    }
  }

  return {
    openCount,
    pipelinePln,
    weightedPipelinePln: Math.round(weightedPipelinePln),
    wonPln,
    planPln: Math.round(planPln),
    forecastWeightedPln: Math.round(wonPln + horizonWeightedPln),
    forecastUnweightedPln: wonPln + horizonPipelinePln,
  }
}

/**
 * Drzewo lejka Pion → Departament → Region → Zespół → RM (Appendix B #6, US-59).
 * Menedżer widzi swój region, zarząd — cały pion; metryki liczone na RM i sumowane w górę.
 */
export function buildOrgPipelineTree(input: {
  units: readonly SalesOrgUnit[]
  users: readonly DemoUser[]
  deals: readonly Deal[]
  clients: readonly Client[]
  plan: KpiPlanSeed
  user: DemoUser
  filters: OrgPipelineFilters
  referenceDate?: Date
}): OrgPipelineNode[] {
  const { units, users, clients, plan, user, filters } = input
  const referenceDate = input.referenceDate ?? getDemoReferenceDate()
  const now = new Date()
  const bounds = getHorizonBounds(filters.horizon, referenceDate)
  const planShare = getPlanShare(plan, filters, referenceDate)

  const segmentByClient = new Map(clients.map((client) => [client.id, client.segment]))
  const deals = filterByScope(input.deals, user).filter(
    (deal) =>
      (!filters.segmentName ||
        (deal.clientId != null &&
          segmentByClient.get(deal.clientId) === filters.segmentName)) &&
      (!filters.pipelineCategoryId ||
        deal.pipelineCategoryId === filters.pipelineCategoryId),
  )
  const dealsByOwner = new Map<string, Deal[]>()
  for (const deal of deals) {
    dealsByOwner.set(deal.ownerId, [...(dealsByOwner.get(deal.ownerId) ?? []), deal])
  }

  const advisors = users.filter((candidate) => candidate.role === "advisor")
  const regionPlan = new Map(plan.byRegion.map((row) => [row.regionId, row.planPln]))
  const advisorsPerRegion = new Map<string, number>()
  for (const advisor of advisors) {
    if (!advisor.regionId) continue
    advisorsPerRegion.set(
      advisor.regionId,
      (advisorsPerRegion.get(advisor.regionId) ?? 0) + 1,
    )
  }

  function buildNode(unit: SalesOrgUnit): OrgPipelineNode {
    const children: OrgPipelineNode[] =
      unit.level === "team"
        ? advisors
            .filter((advisor) => advisor.teamId === unit.id)
            .map((advisor) => {
              const regionId = advisor.regionId ?? ""
              const rmPlan =
                ((regionPlan.get(regionId) ?? 0) /
                  (advisorsPerRegion.get(regionId) ?? 1)) *
                planShare
              return {
                id: advisor.id,
                name: advisor.displayName,
                level: "rm" as const,
                children: [],
                ...computeRmMetrics(
                  dealsByOwner.get(advisor.id) ?? [],
                  rmPlan,
                  filters,
                  bounds,
                  now,
                ),
              }
            })
        : units.filter((child) => child.parentId === unit.id).map(buildNode)
    return {
      id: unit.id,
      name: unit.name,
      level: unit.level,
      children,
      ...sumMetrics(children),
    }
  }

  const roots =
    user.role === "executive"
      ? units.filter((unit) => unit.parentId === null)
      : user.role === "regional_manager"
        ? units.filter(
            (unit) => unit.level === "region" && unit.regionId === user.regionId,
          )
        : []
  return roots.map(buildNode)
}

export function getRealizationPercent(metrics: OrgPipelineMetrics): number {
  if (metrics.planPln <= 0) return 0
  return Math.round((metrics.wonPln / metrics.planPln) * 100)
}
