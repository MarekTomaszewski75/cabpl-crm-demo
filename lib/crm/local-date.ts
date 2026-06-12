/** Data kalendarzowa w strefie lokalnej przeglądarki (bez zamrożonej daty demo). */

export function getToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0)
}

export function getTodayDateKey(): string {
  return toLocalDateKey(getToday())
}

export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatTodayPl(): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(getToday())
}

/** Początek dnia kalendarzowego (lokalnie) — np. filtrowanie spotkań „od dziś”. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}
