import { toLocalDateKey } from "@/lib/crm/local-date"
import type { Deal } from "@/types/crm"

export type DealCloseDateRangeFilter = {
  from?: string
  to?: string
}

function toComparableDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10)
  return toLocalDateKey(parsed)
}

export function isDealCloseDateRangeFilterActive(
  range: DealCloseDateRangeFilter,
): boolean {
  return Boolean(range.from?.trim() || range.to?.trim())
}

export function normalizeDealCloseDateRange(
  range: DealCloseDateRangeFilter,
): { from?: string; to?: string } {
  const from = range.from?.trim() || undefined
  const to = range.to?.trim() || undefined
  if (from && to && from > to) return { from: to, to: from }
  return { from, to }
}

export function matchesDealCloseDateRange(
  expectedCloseDate: string | undefined,
  range: DealCloseDateRangeFilter,
): boolean {
  const { from, to } = normalizeDealCloseDateRange(range)
  if (!from && !to) return true
  if (!expectedCloseDate) return false

  const closeKey = toComparableDateKey(expectedCloseDate)
  if (from && closeKey < from) return false
  if (to && closeKey > to) return false
  return true
}

export function filterDealsByCloseDateRange(
  deals: readonly Deal[],
  range: DealCloseDateRangeFilter,
): Deal[] {
  if (!isDealCloseDateRangeFilterActive(range)) return [...deals]
  return deals.filter((deal) =>
    matchesDealCloseDateRange(deal.expectedCloseDate, range),
  )
}
