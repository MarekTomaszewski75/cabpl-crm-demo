import { getToday } from "@/lib/crm/local-date"
import type { AnalyticsTimePeriod } from "@/types/analytics"

/** Data referencyjna analityki — bieżący dzień (seed jest przesuwany na „dziś”, US-54). */
export function getDemoReferenceDate(): Date {
  const today = getToday()
  return new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12),
  )
}

/** Bieżący kwartał (1–4) względem daty referencyjnej. */
export function getCurrentQuarter(
  referenceDate: Date = getDemoReferenceDate(),
): number {
  return Math.floor(referenceDate.getUTCMonth() / 3) + 1
}

export type PeriodBounds = {
  start: Date
  end: Date
}

export function getPeriodBounds(
  period: AnalyticsTimePeriod,
  referenceDate: Date = getDemoReferenceDate(),
): PeriodBounds {
  const year = referenceDate.getUTCFullYear()
  const month = referenceDate.getUTCMonth()

  switch (period) {
    case "month":
      return {
        start: new Date(Date.UTC(year, month, 1)),
        end: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
      }
    case "quarter": {
      const quarterStartMonth = Math.floor(month / 3) * 3
      return {
        start: new Date(Date.UTC(year, quarterStartMonth, 1)),
        end: new Date(Date.UTC(year, quarterStartMonth + 3, 0, 23, 59, 59, 999)),
      }
    }
    case "ytd":
      return {
        start: new Date(Date.UTC(year, 0, 1)),
        end: referenceDate,
      }
    default: {
      const _exhaustive: never = period
      return _exhaustive
    }
  }
}

export function isDateInPeriod(
  dateValue: string | Date,
  period: AnalyticsTimePeriod,
  referenceDate: Date = getDemoReferenceDate(),
): boolean {
  const date =
    typeof dateValue === "string" ? new Date(dateValue) : dateValue
  const { start, end } = getPeriodBounds(period, referenceDate)
  return date >= start && date <= end
}

export function isBeforeReferenceDay(
  dateValue: string,
  referenceDate: Date = getDemoReferenceDate(),
): boolean {
  const date = new Date(dateValue)
  const dayStart = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  )
  return date < dayStart
}
