import type { AnalyticsTimePeriod } from "@/types/analytics"

/** Stała data referencyjna demo (czerwiec 2026). */
export const DEMO_REFERENCE_DATE = new Date("2026-06-05T12:00:00.000Z")

export type PeriodBounds = {
  start: Date
  end: Date
}

export function getPeriodBounds(
  period: AnalyticsTimePeriod,
  referenceDate: Date = DEMO_REFERENCE_DATE,
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
  referenceDate: Date = DEMO_REFERENCE_DATE,
): boolean {
  const date =
    typeof dateValue === "string" ? new Date(dateValue) : dateValue
  const { start, end } = getPeriodBounds(period, referenceDate)
  return date >= start && date <= end
}

export function isBeforeReferenceDay(
  dateValue: string,
  referenceDate: Date = DEMO_REFERENCE_DATE,
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
