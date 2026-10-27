import { getToday } from "@/lib/crm/local-date"
import type { KpiSnapshot, Meeting, Task } from "@/types/crm"

/**
 * „Dziś” seedu — wokół tego dnia ułożone są dane w `data/*.json`.
 * Przy ładowaniu daty są przesuwane tak, by ten dzień wypadał na bieżącą datę (US-54).
 */
export const SEED_REFERENCE_DATE_KEY = "2026-06-05"

/** Początek historii seedu (leady, deale, aktywności od stycznia). */
const SEED_HISTORY_START_KEY = "2026-01-01"

/** Ostatnie dni przed „dziś” seedu przesuwane 1:1 — zaległości, „wczoraj”, „2 dni temu”. */
const SEED_EXACT_WINDOW_DAYS = 42

/** Pola dat, których nie przesuwamy. */
const SEED_FIXED_DATE_KEYS = new Set(["dateOfBirth"])

const MS_PER_DAY = 24 * 60 * 60 * 1000
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

export type SeedDateRebaser = (value: string) => string

function toDayNumber(year: number, month: number, day: number): number {
  return Math.round(Date.UTC(year, month, day) / MS_PER_DAY)
}

function dateKeyToDayNumber(key: string): number {
  const [year, month, day] = key.split("-").map(Number)
  return toDayNumber(year, month - 1, day)
}

function localDayNumber(date: Date): number {
  return toDayNumber(date.getFullYear(), date.getMonth(), date.getDate())
}

function dayNumberToDateKey(dayNumber: number): string {
  return new Date(dayNumber * MS_PER_DAY).toISOString().slice(0, 10)
}

function shiftDateValue(value: string, days: number): string {
  if (days === 0) return value
  if (DATE_ONLY_PATTERN.test(value)) {
    return dayNumberToDateKey(dateKeyToDayNumber(value) + days)
  }
  const date = new Date(value)
  // setDate w strefie lokalnej zachowuje godzinę zegarową mimo zmiany czasu letni/zimowy.
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function valueDayNumber(value: string): number {
  return DATE_ONLY_PATTERN.test(value)
    ? dateKeyToDayNumber(value)
    : localDayNumber(new Date(value))
}

function isSeedDateValue(value: string): boolean {
  if (DATE_ONLY_PATTERN.test(value)) return true
  return DATE_TIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value))
}

/**
 * Mapuje datę seedu na kalendarz „od dziś”:
 * - okno `SEED_EXACT_WINDOW_DAYS` przed „dziś” seedu i cała przyszłość — przesunięcie 1:1,
 * - starsza historia od 1 stycznia — rozciągnięta do początku bieżącego roku (wykresy YTD bez dziur),
 * - daty sprzed historii (rachunki, produkty) — przesunięcie o tyle, o ile przesunął się początek historii.
 */
export function createSeedDateRebaser(today: Date = getToday()): SeedDateRebaser {
  const referenceDay = dateKeyToDayNumber(SEED_REFERENCE_DATE_KEY)
  const todayDay = localDayNumber(today)
  const historyDays = referenceDay - dateKeyToDayNumber(SEED_HISTORY_START_KEY)
  const targetHistoryDays = Math.max(
    historyDays,
    todayDay - toDayNumber(today.getFullYear(), 0, 1),
  )
  const window = SEED_EXACT_WINDOW_DAYS
  const historyScale = (targetHistoryDays - window) / (historyDays - window)

  function mapDaysFromReference(days: number): number {
    if (days >= -window) return days
    if (days >= -historyDays) {
      return -window - Math.round((-window - days) * historyScale)
    }
    return days - (targetHistoryDays - historyDays)
  }

  return (value) => {
    const valueDay = valueDayNumber(value)
    const targetDay = todayDay + mapDaysFromReference(valueDay - referenceDay)
    return shiftDateValue(value, targetDay - valueDay)
  }
}

function rebaseValue(value: unknown, rebase: SeedDateRebaser, key?: string): unknown {
  if (typeof value === "string") {
    if (key && SEED_FIXED_DATE_KEYS.has(key)) return value
    return isSeedDateValue(value) ? rebase(value) : value
  }
  if (Array.isArray(value)) {
    return value.map((item) => rebaseValue(item, rebase))
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entry]) => [
        entryKey,
        rebaseValue(entry, rebase, entryKey),
      ]),
    )
  }
  return value
}

/** Przesuwa wszystkie daty ISO w strukturze seedu (rekurencyjnie). */
export function rebaseSeedDates<T>(
  value: T,
  rebase: SeedDateRebaser = createSeedDateRebaser(),
): T {
  return rebaseValue(value, rebase) as T
}

/** Sobota → piątek, niedziela → poniedziałek. */
function weekendShiftDays(weekday: number): number {
  if (weekday === 6) return -1
  if (weekday === 0) return 1
  return 0
}

/** Po przesunięciu spotkania nie wypadają w weekend (czas trwania bez zmian). */
export function moveMeetingsOffWeekend(meetings: Meeting[]): Meeting[] {
  return meetings.map((meeting) => {
    const days = weekendShiftDays(new Date(meeting.startsAt).getDay())
    if (days === 0) return meeting
    return {
      ...meeting,
      startsAt: shiftDateValue(meeting.startsAt, days),
      endsAt: shiftDateValue(meeting.endsAt, days),
    }
  })
}

/** Po przesunięciu terminy zadań nie wypadają w weekend. */
export function moveTasksOffWeekend(tasks: Task[]): Task[] {
  return tasks.map((task) => {
    const weekday = new Date(dateKeyToDayNumber(task.dueDate) * MS_PER_DAY).getUTCDay()
    const days = weekendShiftDays(weekday)
    if (days === 0) return task
    return { ...task, dueDate: shiftDateValue(task.dueDate, days) }
  })
}

function scaleYtdAmount(value: number, scale: number): number {
  return Math.round((value * scale) / 100_000) * 100_000
}

/**
 * KPI seedu opisują YTD do czerwca. Trend miesięczny obcinamy do bieżącego miesiąca,
 * a kwoty YTD skalujemy proporcjonalnie do planu narastającego.
 */
export function rebaseKpiSnapshot(
  kpi: KpiSnapshot,
  today: Date = getToday(),
): KpiSnapshot {
  const seedMonth = Number(SEED_REFERENCE_DATE_KEY.slice(5, 7)) - 1
  const monthlyTrend = kpi.monthlyTrend.slice(0, today.getMonth() + 1)
  const sumPlan = (rows: KpiSnapshot["monthlyTrend"]) =>
    rows.reduce((total, row) => total + row.planPln, 0)
  const seedPlan = sumPlan(kpi.monthlyTrend.slice(0, seedMonth + 1))
  const scale = seedPlan > 0 ? sumPlan(monthlyTrend) / seedPlan : 1
  const scaleRow = <
    T extends { planPln: number; actualPln: number; forecastPln: number },
  >(
    row: T,
  ): T => ({
    ...row,
    planPln: scaleYtdAmount(row.planPln, scale),
    actualPln: scaleYtdAmount(row.actualPln, scale),
    forecastPln: scaleYtdAmount(row.forecastPln, scale),
  })

  return {
    ...kpi,
    planYtdPln: scaleYtdAmount(kpi.planYtdPln, scale),
    actualYtdPln: scaleYtdAmount(kpi.actualYtdPln, scale),
    forecastYtdPln: scaleYtdAmount(kpi.forecastYtdPln, scale),
    forecastOptimisticPln: scaleYtdAmount(kpi.forecastOptimisticPln, scale),
    forecastPessimisticPln: scaleYtdAmount(kpi.forecastPessimisticPln, scale),
    byRegion: kpi.byRegion.map(scaleRow),
    bySegment: kpi.bySegment.map(scaleRow),
    byCategory: kpi.byCategory.map(scaleRow),
    monthlyTrend,
  }
}
