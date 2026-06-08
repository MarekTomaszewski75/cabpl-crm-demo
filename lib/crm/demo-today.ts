/**
 * Ustalona data „dziś” w demo (czerwiec 2026) — spójna z seed przy prezentacji,
 * niezależna od daty systemowej laptopa prezentera.
 */
export const DEMO_TODAY_DATE_KEY = "2026-06-03"

export function getDemoToday(): Date {
  const [year, month, day] = DEMO_TODAY_DATE_KEY.split("-").map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatDemoTodayPl(): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(getDemoToday())
}
