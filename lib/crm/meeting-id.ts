import type { Meeting } from "@/types/crm"

export function createNextMeetingId(existing: readonly Meeting[]): string {
  const max = existing.reduce((acc, meeting) => {
    const match = /^meeting-(\d+)$/.exec(meeting.id)
    if (!match) {
      return acc
    }
    const num = Number.parseInt(match[1], 10)
    return Number.isNaN(num) ? acc : Math.max(acc, num)
  }, 0)
  return `meeting-${String(max + 1).padStart(3, "0")}`
}
