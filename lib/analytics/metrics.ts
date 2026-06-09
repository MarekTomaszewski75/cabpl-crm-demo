import {
  DEAL_SOURCE_LABELS,
  DEAL_STATUS_LABELS,
  isTerminalDealStatus,
} from "@/lib/crm/deal-labels"
import { TASK_PRIORITY_LABELS, TASK_PRIORITY_OPTIONS } from "@/lib/crm/task-labels"
import {
  DEMO_REFERENCE_DATE,
  isBeforeReferenceDay,
  isDateInPeriod,
} from "@/lib/analytics/filters"
import { filterAnalyticsEntities } from "@/lib/analytics/scope"
import { getPipelineSteps } from "@/lib/crm/deal-pipeline"
import type { AnalyticsGlobalFilters } from "@/types/analytics"
import type {
  Deal,
  DealSource,
  DealStatus,
  DemoUser,
  Lead,
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

type AnalyticsData = {
  leads: readonly Lead[]
  deals: readonly Deal[]
  tasks: readonly Task[]
  users: readonly DemoUser[]
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

function scopedLeads(data: AnalyticsData, user: DemoUser, filters: AnalyticsGlobalFilters) {
  return filterAnalyticsEntities(data.leads, user, filters)
}

function scopedDeals(data: AnalyticsData, user: DemoUser, filters: AnalyticsGlobalFilters) {
  return filterAnalyticsEntities(data.deals, user, filters)
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

export function getAnalyticsMetric(
  metricKey: string,
  data: AnalyticsData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): number | DealFunnelRow[] | WonAmountBySourceRow[] | OverdueTasksByOwnerRow[] | TasksByPriorityRow[] {
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
    default:
      return 0
  }
}
