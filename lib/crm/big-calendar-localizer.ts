import { format, getDay, startOfWeek } from "date-fns"
import { pl } from "date-fns/locale"
import { dateFnsLocalizer } from "react-big-calendar"

export const CALENDAR_CULTURE = "pl-PL"

export const calendarLocalizer = dateFnsLocalizer({
  format,
  getDay,
  startOfWeek: (date: Date) =>
    startOfWeek(date, { weekStartsOn: 1, locale: pl }),
  locales: { [CALENDAR_CULTURE]: pl },
})

export const calendarMessagesPl = {
  allDay: "Cały dzień",
  previous: "Wstecz",
  next: "Dalej",
  today: "Dziś",
  month: "Miesiąc",
  week: "Tydzień",
  day: "Dzień",
  agenda: "Agenda",
  date: "Data",
  time: "Czas",
  event: "Spotkanie",
  noEventsInRange: "Brak spotkań w tym tygodniu.",
  showMore: (total: number) => `+${total} więcej`,
} as const
