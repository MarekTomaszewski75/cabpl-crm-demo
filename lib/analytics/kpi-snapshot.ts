import { getCurrentQuarter, getDemoReferenceDate } from "@/lib/analytics/filters"
import { isTerminalDealStatus } from "@/lib/crm/deal-pipeline"
import type {
  Client,
  Deal,
  KpiBreakdownRow,
  KpiMonthlyTrendRow,
  KpiPlanSeed,
  KpiSnapshot,
} from "@/types/crm"

/** Mnożniki ważonego lejka w scenariuszach prognozy. */
const FORECAST_OPTIMISTIC_FACTOR = 1.25
const FORECAST_PESSIMISTIC_FACTOR = 0.7

type DealFilter = (deal: Deal) => boolean

type PeriodTotals = {
  actualPln: number
  forecastPln: number
  forecastOptimisticPln: number
  forecastPessimisticPln: number
}

function endOfUtcMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))
}

function sumPlan(rows: KpiPlanSeed["monthlyPlan"]): number {
  return rows.reduce((total, row) => total + row.planPln, 0)
}

/**
 * Realizacja = wygrane z `finishedAt` w [start, end];
 * prognoza = realizacja + ważony lejek otwartych deali z zamknięciem do `end` (także przeterminowane).
 */
function computePeriodTotals(
  deals: readonly Deal[],
  start: Date,
  end: Date,
): PeriodTotals {
  let actualPln = 0
  let weightedPln = 0
  for (const deal of deals) {
    const amount = deal.amount ?? 0
    if (deal.status === "won") {
      if (!deal.finishedAt) continue
      const finishedAt = new Date(deal.finishedAt)
      if (finishedAt >= start && finishedAt <= end) actualPln += amount
      continue
    }
    if (isTerminalDealStatus(deal.status) || !deal.expectedCloseDate) continue
    if (new Date(deal.expectedCloseDate) <= end) {
      weightedPln += (amount * (deal.probability ?? 0)) / 100
    }
  }
  return {
    actualPln,
    forecastPln: Math.round(actualPln + weightedPln),
    forecastOptimisticPln: Math.round(
      actualPln + weightedPln * FORECAST_OPTIMISTIC_FACTOR,
    ),
    forecastPessimisticPln: Math.round(
      actualPln + weightedPln * FORECAST_PESSIMISTIC_FACTOR,
    ),
  }
}

/**
 * Snapshot KPI z planu rocznego i bieżących deali (US-55).
 * YTD = od 1 stycznia do końca bieżącego miesiąca, kwartał = pełny bieżący kwartał;
 * plan regionu/segmentu/kategorii = jego udział w planie rocznym × plan okresu.
 */
export function deriveKpiSnapshot(
  plan: KpiPlanSeed,
  deals: readonly Deal[],
  clients: readonly Client[],
  referenceDate: Date = getDemoReferenceDate(),
): KpiSnapshot {
  const year = referenceDate.getUTCFullYear()
  const month = referenceDate.getUTCMonth()
  const quarter = getCurrentQuarter(referenceDate)
  const quarterStartMonth = (quarter - 1) * 3

  const annualPlan = sumPlan(plan.monthlyPlan)
  const ytdPlan = sumPlan(plan.monthlyPlan.slice(0, month + 1))
  const quarterPlan = sumPlan(
    plan.monthlyPlan.filter((row) => row.quarter === quarter),
  )
  const ytdStart = new Date(Date.UTC(year, 0, 1))
  const ytdEnd = endOfUtcMonth(year, month)
  const quarterStart = new Date(Date.UTC(year, quarterStartMonth, 1))
  const quarterEnd = endOfUtcMonth(year, quarterStartMonth + 2)

  const segmentIdByName = new Map(
    plan.bySegment.map((row) => [row.segmentName, row.segmentId]),
  )
  const segmentIdByClient = new Map(
    clients.map((client) => [client.id, segmentIdByName.get(client.segment)]),
  )

  function breakdown(annualRowPlan: number, filter: DealFilter): KpiBreakdownRow {
    const scoped = deals.filter(filter)
    const ytd = computePeriodTotals(scoped, ytdStart, ytdEnd)
    const q = computePeriodTotals(scoped, quarterStart, quarterEnd)
    const share = annualPlan > 0 ? annualRowPlan / annualPlan : 0
    return {
      planPln: Math.round(ytdPlan * share),
      actualPln: ytd.actualPln,
      forecastPln: ytd.forecastPln,
      planQuarterPln: Math.round(quarterPlan * share),
      actualQuarterPln: q.actualPln,
      forecastQuarterPln: q.forecastPln,
      forecastOptimisticQuarterPln: q.forecastOptimisticPln,
      forecastPessimisticQuarterPln: q.forecastPessimisticPln,
    }
  }

  const bankYtd = computePeriodTotals(deals, ytdStart, ytdEnd)
  const bankQuarter = computePeriodTotals(deals, quarterStart, quarterEnd)

  const monthlyTrend: KpiMonthlyTrendRow[] = plan.monthlyPlan
    .slice(0, month + 1)
    .map((row, index) => {
      const totals = computePeriodTotals(
        deals,
        new Date(Date.UTC(year, index, 1)),
        endOfUtcMonth(year, index),
      )
      // Zamknięte miesiące: prognoza = realizacja; ważony lejek tylko w bieżącym.
      const closed = index < month
      return {
        ...row,
        actualPln: totals.actualPln,
        forecastPln: closed ? totals.actualPln : totals.forecastPln,
        forecastOptimisticPln: closed
          ? totals.actualPln
          : totals.forecastOptimisticPln,
        forecastPessimisticPln: closed
          ? totals.actualPln
          : totals.forecastPessimisticPln,
      }
    })

  return {
    planYtdPln: ytdPlan,
    actualYtdPln: bankYtd.actualPln,
    forecastYtdPln: bankYtd.forecastPln,
    forecastOptimisticPln: bankYtd.forecastOptimisticPln,
    forecastPessimisticPln: bankYtd.forecastPessimisticPln,
    planQuarterPln: quarterPlan,
    actualQuarterPln: bankQuarter.actualPln,
    forecastQuarterPln: bankQuarter.forecastPln,
    forecastOptimisticQuarterPln: bankQuarter.forecastOptimisticPln,
    forecastPessimisticQuarterPln: bankQuarter.forecastPessimisticPln,
    byRegion: plan.byRegion.map((row) => ({
      regionId: row.regionId,
      regionName: row.regionName,
      ...breakdown(row.planPln, (deal) => deal.regionId === row.regionId),
    })),
    bySegment: plan.bySegment.map((row) => ({
      segmentId: row.segmentId,
      segmentName: row.segmentName,
      ...breakdown(
        row.planPln,
        (deal) =>
          deal.clientId != null &&
          segmentIdByClient.get(deal.clientId) === row.segmentId,
      ),
    })),
    byCategory: plan.byCategory.map((row) => ({
      pipelineCategoryId: row.pipelineCategoryId,
      categoryName: row.categoryName,
      ...breakdown(
        row.planPln,
        (deal) => deal.pipelineCategoryId === row.pipelineCategoryId,
      ),
    })),
    monthlyTrend,
  }
}
