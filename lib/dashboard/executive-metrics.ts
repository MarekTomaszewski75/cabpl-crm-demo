import type {
  KpiBreakdownRow,
  KpiMonthlyTrendRow,
  KpiSnapshot,
} from "@/types/crm"

export type ExecutiveTimePeriod = "ytd" | "quarter"

export type ExecutiveDashboardFilters = {
  timePeriod: ExecutiveTimePeriod
  regionId: string
  segmentId: string
  pipelineCategoryId: string
}

export const EXECUTIVE_FILTER_ALL = "all"

export type ExecutiveTotals = {
  planPln: number
  actualPln: number
  forecastPln: number
  forecastOptimisticPln: number
  forecastPessimisticPln: number
  realizationPercent: number
}

export type ExecutiveChartRow = {
  label: string
  planPln: number
  actualPln: number
  forecastPln: number
  forecastOptimisticPln: number
  forecastPessimisticPln: number
}

function pickPeriodValues(
  row: KpiBreakdownRow,
  timePeriod: ExecutiveTimePeriod
) {
  if (timePeriod === "quarter") {
    return {
      planPln: row.planQuarterPln,
      actualPln: row.actualQuarterPln,
      forecastPln: row.forecastQuarterPln,
      forecastOptimisticPln: row.forecastOptimisticQuarterPln,
      forecastPessimisticPln: row.forecastPessimisticQuarterPln,
    }
  }
  return {
    planPln: row.planPln,
    actualPln: row.actualPln,
    forecastPln: row.forecastPln,
    forecastOptimisticPln: row.forecastPln,
    forecastPessimisticPln: row.forecastPln,
  }
}

function pickBankWideTotals(
  kpi: KpiSnapshot,
  timePeriod: ExecutiveTimePeriod
): Omit<ExecutiveTotals, "realizationPercent"> {
  if (timePeriod === "quarter") {
    return {
      planPln: kpi.planQuarterPln,
      actualPln: kpi.actualQuarterPln,
      forecastPln: kpi.forecastQuarterPln,
      forecastOptimisticPln: kpi.forecastOptimisticQuarterPln,
      forecastPessimisticPln: kpi.forecastPessimisticQuarterPln,
    }
  }
  return {
    planPln: kpi.planYtdPln,
    actualPln: kpi.actualYtdPln,
    forecastPln: kpi.forecastYtdPln,
    forecastOptimisticPln: kpi.forecastOptimisticPln,
    forecastPessimisticPln: kpi.forecastPessimisticPln,
  }
}

function countActiveExecutiveFilters(
  filters: ExecutiveDashboardFilters
): number {
  let count = 0
  if (filters.regionId !== EXECUTIVE_FILTER_ALL) count++
  if (filters.segmentId !== EXECUTIVE_FILTER_ALL) count++
  if (filters.pipelineCategoryId !== EXECUTIVE_FILTER_ALL) count++
  return count
}

function getFilterScale(
  kpi: KpiSnapshot,
  filters: ExecutiveDashboardFilters
): number {
  let scale = 1
  if (filters.regionId !== EXECUTIVE_FILTER_ALL) {
    const region = kpi.byRegion.find((row) => row.regionId === filters.regionId)
    if (region) {
      const { actualPln } = pickPeriodValues(region, filters.timePeriod)
      const bankActual = pickBankWideTotals(kpi, filters.timePeriod).actualPln
      scale *= bankActual > 0 ? actualPln / bankActual : 0
    }
  }
  if (filters.segmentId !== EXECUTIVE_FILTER_ALL) {
    const segment = kpi.bySegment.find(
      (row) => row.segmentId === filters.segmentId
    )
    if (segment) {
      const { actualPln } = pickPeriodValues(segment, filters.timePeriod)
      const bankActual = pickBankWideTotals(kpi, filters.timePeriod).actualPln
      scale *= bankActual > 0 ? actualPln / bankActual : 0
    }
  }
  if (filters.pipelineCategoryId !== EXECUTIVE_FILTER_ALL) {
    const category = kpi.byCategory.find(
      (row) => row.pipelineCategoryId === filters.pipelineCategoryId
    )
    if (category) {
      const { actualPln } = pickPeriodValues(category, filters.timePeriod)
      const bankActual = pickBankWideTotals(kpi, filters.timePeriod).actualPln
      scale *= bankActual > 0 ? actualPln / bankActual : 0
    }
  }
  return scale
}

function scaleTotals(
  totals: Omit<ExecutiveTotals, "realizationPercent">,
  scale: number
): Omit<ExecutiveTotals, "realizationPercent"> {
  return {
    planPln: Math.round(totals.planPln * scale),
    actualPln: Math.round(totals.actualPln * scale),
    forecastPln: Math.round(totals.forecastPln * scale),
    forecastOptimisticPln: Math.round(totals.forecastOptimisticPln * scale),
    forecastPessimisticPln: Math.round(totals.forecastPessimisticPln * scale),
  }
}

export function computeRealizationPercent(
  actualPln: number,
  planPln: number
): number {
  if (planPln <= 0) return 0
  return Math.min(100, Math.round((actualPln / planPln) * 100))
}

export function getExecutiveTotals(
  kpi: KpiSnapshot,
  filters: ExecutiveDashboardFilters
): ExecutiveTotals {
  const { regionId, segmentId, pipelineCategoryId, timePeriod } = filters
  const activeFilterCount = countActiveExecutiveFilters(filters)

  let base: Omit<ExecutiveTotals, "realizationPercent">

  if (activeFilterCount === 1) {
    if (regionId !== EXECUTIVE_FILTER_ALL) {
      const region = kpi.byRegion.find((row) => row.regionId === regionId)
      base = region
        ? pickPeriodValues(region, timePeriod)
        : pickBankWideTotals(kpi, timePeriod)
    } else if (segmentId !== EXECUTIVE_FILTER_ALL) {
      const segment = kpi.bySegment.find((row) => row.segmentId === segmentId)
      base = segment
        ? pickPeriodValues(segment, timePeriod)
        : pickBankWideTotals(kpi, timePeriod)
    } else {
      const category = kpi.byCategory.find(
        (row) => row.pipelineCategoryId === pipelineCategoryId
      )
      base = category
        ? pickPeriodValues(category, timePeriod)
        : pickBankWideTotals(kpi, timePeriod)
    }
  } else if (activeFilterCount > 1) {
    const bank = pickBankWideTotals(kpi, timePeriod)
    const scale = getFilterScale(kpi, filters)
    base = scaleTotals(bank, scale)
  } else {
    base = pickBankWideTotals(kpi, timePeriod)
  }

  return {
    ...base,
    realizationPercent: computeRealizationPercent(
      base.actualPln,
      base.planPln
    ),
  }
}

function scaleMonthlyRow(
  row: KpiMonthlyTrendRow,
  scale: number
): ExecutiveChartRow {
  return {
    label: row.monthLabel,
    planPln: Math.round(row.planPln * scale),
    actualPln: Math.round(row.actualPln * scale),
    forecastPln: Math.round(row.forecastPln * scale),
    forecastOptimisticPln: Math.round(row.forecastOptimisticPln * scale),
    forecastPessimisticPln: Math.round(row.forecastPessimisticPln * scale),
  }
}

/** Bieżący kwartał demo (czerwiec 2026 → Q2). */
const DEMO_CURRENT_QUARTER = 2

export function getExecutiveChartRows(
  kpi: KpiSnapshot,
  filters: ExecutiveDashboardFilters
): ExecutiveChartRow[] {
  const scale = getFilterScale(kpi, filters)
  const months =
    filters.timePeriod === "quarter"
      ? kpi.monthlyTrend.filter((row) => row.quarter === DEMO_CURRENT_QUARTER)
      : kpi.monthlyTrend

  return months.map((row) => scaleMonthlyRow(row, scale))
}

export function getExecutiveTimePeriodLabel(
  timePeriod: ExecutiveTimePeriod
): string {
  return timePeriod === "ytd" ? "YTD" : "Bieżący kwartał (Q2)"
}
