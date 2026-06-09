const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
})

export function formatCurrencyPln(value: number) {
  return currencyFormatter.format(value)
}

export function formatDatePl(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  return dateFormatter.format(date)
}

export function formatTimePl(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  return timeFormatter.format(date)
}

/** Prosty czas względny PL — np. „2 godz. temu”, „za 3 dni”. */
export function formatRelativeTimePl(date: Date, base: Date = new Date()): string {
  const diffMs = date.getTime() - base.getTime()
  const diffMin = Math.round(diffMs / (60 * 1000))

  if (Math.abs(diffMin) < 1) {
    return diffMin >= 0 ? "za chwilę" : "przed chwilą"
  }

  if (Math.abs(diffMin) < 60) {
    return diffMin >= 0 ? `za ${diffMin} min` : `${-diffMin} min temu`
  }

  const diffHours = Math.round(diffMs / (60 * 60 * 1000))
  if (Math.abs(diffHours) < 24) {
    return diffHours >= 0 ? `za ${diffHours} godz.` : `${-diffHours} godz. temu`
  }

  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000))
  if (diffDays === 1) return "jutro"
  if (diffDays === -1) return "wczoraj"
  if (Math.abs(diffDays) < 7) {
    return diffDays >= 0 ? `za ${diffDays} dni` : `${-diffDays} dni temu`
  }

  return formatDatePl(date)
}
