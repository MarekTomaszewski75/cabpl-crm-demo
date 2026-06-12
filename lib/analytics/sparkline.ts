import { DEMO_REFERENCE_DATE, getPeriodBounds } from "@/lib/analytics/filters"
import {
  applyPipelineCategoryFilter,
  filterAnalyticsEntities,
} from "@/lib/analytics/scope"
import { isTerminalDealStatus } from "@/lib/crm/deal-labels"
import type { AnalyticsGlobalFilters, AnalyticsTimePeriod } from "@/types/analytics"
import type { Deal, DemoUser, Lead, Task } from "@/types/crm"

export type SparklinePoint = {
  label: string
  value: number
}

type TimeBucket = {
  label: string
  start: Date
  end: Date
}

const MONTH_LABELS = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
] as const

function isInBucket(dateValue: string, bucket: TimeBucket): boolean {
  const date = new Date(dateValue)
  return date >= bucket.start && date <= bucket.end
}

export function getSparklineBuckets(
  period: AnalyticsTimePeriod,
  referenceDate: Date = DEMO_REFERENCE_DATE,
): TimeBucket[] {
  const { start, end } = getPeriodBounds(period, referenceDate)

  if (period === "month") {
    const buckets: TimeBucket[] = []
    let cursor = new Date(start)
    let week = 1
    while (cursor <= end) {
      const bucketEnd = new Date(cursor)
      bucketEnd.setUTCDate(bucketEnd.getUTCDate() + 6)
      bucketEnd.setUTCHours(23, 59, 59, 999)
      const clampedEnd = bucketEnd > end ? end : bucketEnd
      buckets.push({
        label: `T${week}`,
        start: new Date(cursor),
        end: clampedEnd,
      })
      cursor = new Date(clampedEnd)
      cursor.setUTCDate(cursor.getUTCDate() + 1)
      cursor.setUTCHours(0, 0, 0, 0)
      week += 1
    }
    return buckets
  }

  if (period === "quarter") {
    const buckets: TimeBucket[] = []
    const cursor = new Date(start)
    while (cursor <= end) {
      const monthEnd = new Date(
        Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0, 23, 59, 59, 999),
      )
      const clampedEnd = monthEnd > end ? end : monthEnd
      buckets.push({
        label: MONTH_LABELS[cursor.getUTCMonth()],
        start: new Date(cursor),
        end: clampedEnd,
      })
      cursor.setUTCMonth(cursor.getUTCMonth() + 1, 1)
      cursor.setUTCHours(0, 0, 0, 0)
    }
    return buckets
  }

  const buckets: TimeBucket[] = []
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), 0, 1))
  const endMonth = end.getUTCMonth()
  while (cursor.getUTCMonth() <= endMonth && cursor.getUTCFullYear() === start.getUTCFullYear()) {
    const monthEnd = new Date(
      Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0, 23, 59, 59, 999),
    )
    const clampedEnd = monthEnd > end ? end : monthEnd
    buckets.push({
      label: MONTH_LABELS[cursor.getUTCMonth()],
      start: new Date(cursor),
      end: clampedEnd,
    })
    cursor.setUTCMonth(cursor.getUTCMonth() + 1, 1)
  }
  return buckets
}

function buildSparkline(
  buckets: TimeBucket[],
  values: number[],
): SparklinePoint[] {
  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: values[index] ?? 0,
  }))
}

type AnalyticsSparklineData = {
  leads: readonly Lead[]
  deals: readonly Deal[]
  tasks: readonly Task[]
}

function getDealClosedDate(deal: Deal): string | null {
  if (deal.finishedAt) return deal.finishedAt
  if (deal.expectedCloseDate) return deal.expectedCloseDate
  return null
}

export function getMetricSparkline(
  metricKey: string,
  data: AnalyticsSparklineData,
  user: DemoUser,
  filters: AnalyticsGlobalFilters,
): SparklinePoint[] {
  const buckets = getSparklineBuckets(filters.timePeriod)
  const leads = filterAnalyticsEntities(data.leads, user, filters)
  const deals = applyPipelineCategoryFilter(
    filterAnalyticsEntities(data.deals, user, filters),
    filters.pipelineCategoryId,
  )
  const tasks = filterAnalyticsEntities(data.tasks, user, filters)

  switch (metricKey) {
    case "new_leads_count":
      return buildSparkline(
        buckets,
        buckets.map(
          (bucket) =>
            leads.filter(
              (lead) =>
                lead.status === "new" && isInBucket(lead.createdAt, bucket),
            ).length,
        ),
      )
    case "won_deals_count":
      return buildSparkline(
        buckets,
        buckets.map(
          (bucket) =>
            deals.filter((deal) => {
              if (deal.status !== "won") return false
              const closedDate = getDealClosedDate(deal) ?? deal.createdAt
              return isInBucket(closedDate, bucket)
            }).length,
        ),
      )
    case "open_deals_count":
      return buildSparkline(
        buckets,
        buckets.map(
          (bucket) =>
            deals.filter(
              (deal) =>
                !isTerminalDealStatus(deal.status) &&
                isInBucket(deal.createdAt, bucket),
            ).length,
        ),
      )
    case "overdue_tasks_count":
      return buildSparkline(
        buckets,
        buckets.map(
          (bucket) =>
            tasks.filter(
              (task) =>
                !task.completed &&
                isInBucket(task.dueDate, bucket) &&
                new Date(task.dueDate) <
                  new Date(
                    Date.UTC(
                      DEMO_REFERENCE_DATE.getUTCFullYear(),
                      DEMO_REFERENCE_DATE.getUTCMonth(),
                      DEMO_REFERENCE_DATE.getUTCDate(),
                    ),
                  ),
            ).length,
        ),
      )
    case "avg_deal_value":
      return buildSparkline(
        buckets,
        buckets.map((bucket) => {
          const bucketDeals = deals.filter(
            (deal) =>
              (deal.status === "won" || !isTerminalDealStatus(deal.status)) &&
              isInBucket(deal.createdAt, bucket),
          )
          if (bucketDeals.length === 0) return 0
          const total = bucketDeals.reduce(
            (sum, deal) => sum + (deal.amount ?? 0),
            0,
          )
          return Math.round(total / bucketDeals.length / 1000)
        }),
      )
    case "avg_deal_duration_days":
      return buildSparkline(
        buckets,
        buckets.map((bucket) => {
          const closed = deals.filter((deal) => {
            if (!isTerminalDealStatus(deal.status)) return false
            const closedDate = getDealClosedDate(deal) ?? deal.createdAt
            return isInBucket(closedDate, bucket)
          })
          if (closed.length === 0) return 0
          const totalDays = closed.reduce((sum, deal) => {
            const end = new Date(getDealClosedDate(deal) ?? deal.createdAt)
            const start = new Date(deal.createdAt)
            return (
              sum +
              Math.max(
                0,
                Math.round(
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
                ),
              )
            )
          }, 0)
          return Math.round(totalDays / closed.length)
        }),
      )
    default:
      return buckets.map((bucket) => ({ label: bucket.label, value: 0 }))
  }
}
