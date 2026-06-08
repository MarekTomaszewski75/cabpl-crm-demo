import type { Deal, DemoUser, KpiSnapshot } from "@/types/crm"

export type PipelineMetrics = {
  activeCount: number
  totalPln: number
  weightedPln: number
}

export function computePipelineMetrics(
  opportunities: readonly Deal[]
): PipelineMetrics {
  const active = opportunities.filter(
    (opp) => opp.status !== "won" && opp.status !== "lost"
  )
  const totalPln = active.reduce((sum, opp) => sum + (opp.amount ?? 0), 0)
  const weightedPln = active.reduce(
    (sum, opp) => sum + (opp.amount ?? 0) * ((opp.probability ?? 0) / 100),
    0
  )
  return {
    activeCount: active.length,
    totalPln,
    weightedPln,
  }
}

/** Luka do planu regionu (menedżer) — plan minus weighted pipeline. */
export function getRegionGapToPlanPln(
  weightedPln: number,
  user: DemoUser,
  kpi: KpiSnapshot
): number | null {
  if (user.role !== "regional_manager" || user.regionId === null) {
    return null
  }
  const region = kpi.byRegion.find((row) => row.regionId === user.regionId)
  if (!region) return null
  return region.planPln - weightedPln
}
