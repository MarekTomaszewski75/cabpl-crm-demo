const weekRangeFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function getMondayOfWeek(reference: Date = new Date()): Date {
  const d = new Date(reference)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const offset = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + offset)
  return d
}

export function getWeekDays(reference: Date = new Date()): Date[] {
  const monday = getMondayOfWeek(reference)
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return day
  })
}

export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatWeekRangePl(weekDays: readonly Date[]): string {
  if (weekDays.length === 0) {
    return ""
  }
  const first = weekDays[0]
  const last = weekDays[weekDays.length - 1]
  return `${weekRangeFormatter.format(first)} – ${weekRangeFormatter.format(last)}`
}
