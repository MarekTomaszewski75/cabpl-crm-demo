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
