/** Kolory spotkań wg opiekuna — tokeny CA, czytelne na tle kalendarza. */
export const CALENDAR_OWNER_STYLES = [
  { bg: "var(--chart-2)", fg: "var(--ca-on-lime)" },
  { bg: "var(--pipeline-qualification-bg)", fg: "var(--pipeline-qualification-fg)" },
  { bg: "var(--pipeline-offer-bg)", fg: "var(--pipeline-offer-fg)" },
  { bg: "var(--pipeline-negotiation-bg)", fg: "var(--pipeline-negotiation-fg)" },
  { bg: "var(--chart-4)", fg: "var(--ca-on-lime)" },
  { bg: "var(--pipeline-lead-bg)", fg: "var(--pipeline-lead-fg)" },
] as const

export type CalendarOwnerStyle = (typeof CALENDAR_OWNER_STYLES)[number]

export function getCalendarOwnerStyle(
  ownerId: string,
  sortedOwnerIds: readonly string[],
): CalendarOwnerStyle {
  const index = sortedOwnerIds.indexOf(ownerId)
  const safeIndex = index >= 0 ? index : 0
  return CALENDAR_OWNER_STYLES[safeIndex % CALENDAR_OWNER_STYLES.length]
}
