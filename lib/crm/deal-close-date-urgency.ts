import { isTerminalDealStatus } from "@/lib/crm/deal-pipeline"
import { getToday, toLocalDateKey } from "@/lib/crm/local-date"
import { TODAY_PIPELINE_HORIZON_DAYS } from "@/lib/crm/today-pipeline-summary"
import { formatDatePl } from "@/lib/format/pl"
import type { Deal } from "@/types/crm"

export const DEAL_EXPECTED_CLOSE_DATE_LABEL = "Planowana data zamknięcia"

export type DealCloseDateUrgency = "none" | "approaching" | "overdue"

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toComparableDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10)
  return toLocalDateKey(parsed)
}

function parseDateKey(dateKey: string): Date {
  const normalized = toComparableDateKey(dateKey)
  const [year, month, day] = normalized.split("-").map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function calendarDaysBetween(earlier: Date, later: Date): number {
  const start = startOfLocalDay(earlier)
  const end = startOfLocalDay(later)
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
}

function resolveAsOfDate(asOfDate?: Date): Date {
  return asOfDate ?? getToday()
}

export function getDealCloseDateUrgency(
  deal: Deal,
  asOfDate?: Date,
): DealCloseDateUrgency {
  if (isTerminalDealStatus(deal.status)) return "none"
  if (!deal.expectedCloseDate) return "none"

  const asOf = resolveAsOfDate(asOfDate)
  const asOfKey = toLocalDateKey(asOf)
  const closeKey = toComparableDateKey(deal.expectedCloseDate)

  if (closeKey < asOfKey) return "overdue"

  const horizonEndKey = toLocalDateKey(
    addCalendarDays(asOf, TODAY_PIPELINE_HORIZON_DAYS),
  )
  if (closeKey >= asOfKey && closeKey <= horizonEndKey) return "approaching"

  return "none"
}

export function getDealCloseDateUrgencyTooltip(
  deal: Deal,
  urgency: DealCloseDateUrgency,
  asOfDate?: Date,
): string | null {
  if (urgency === "none" || !deal.expectedCloseDate) return null

  const formatted = formatDatePl(deal.expectedCloseDate)
  const asOf = resolveAsOfDate(asOfDate)

  if (urgency === "overdue") {
    const daysOverdue = calendarDaysBetween(
      parseDateKey(deal.expectedCloseDate),
      asOf,
    )
    if (daysOverdue === 1) {
      return `Przekroczono planowaną datę zamknięcia wczoraj (${formatted})`
    }
    return `Przekroczono planowaną datę zamknięcia ${daysOverdue} dni temu (${formatted})`
  }

  const daysUntil = calendarDaysBetween(asOf, parseDateKey(deal.expectedCloseDate))
  if (daysUntil === 0) {
    return `Termin zamknięcia dziś (${formatted})`
  }
  if (daysUntil === 1) {
    return `Termin zamknięcia jutro (${formatted})`
  }
  return `Termin zamknięcia za ${daysUntil} dni (${formatted})`
}

/** Format notatki timeline przy zmianie terminu zamknięcia. */
export function formatDealExpectedCloseDateChangeNote(
  previous: string | undefined,
  next: string | undefined,
): string {
  if (!previous && next) {
    return `Ustawiono: ${formatDatePl(next)}`
  }
  if (previous && !next) {
    return `Usunięto termin (było: ${formatDatePl(previous)})`
  }
  if (previous && next) {
    return `${formatDatePl(previous)} → ${formatDatePl(next)}`
  }
  return ""
}
