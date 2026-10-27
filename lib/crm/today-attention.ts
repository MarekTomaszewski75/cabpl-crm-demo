import { getDealAmountPln } from "@/lib/crm/currency"
import { isTerminalDealStatus } from "@/lib/crm/deal-pipeline"
import { toLocalDateKey } from "@/lib/crm/local-date"
import type {
  ClientBankingProduct,
  Deal,
  DealActivity,
  Meeting,
  Task,
} from "@/types/crm"

/** Szansa bez aktywności dłużej niż N dni (QW-10). */
export const STALE_DEAL_DAYS = 14
/** Horyzont odnowień produktów klienta. */
export const RENEWAL_HORIZON_DAYS = 90

const MS_PER_DAY = 24 * 60 * 60 * 1000

function calendarDaysBetween(from: Date, to: Date): number {
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((toDay - fromDay) / MS_PER_DAY)
}

export type OverdueTask = { task: Task; daysOverdue: number }

/** Otwarte zadania z terminem przed dziś — najstarsze pierwsze. */
export function getOverdueTasks(
  tasks: readonly Task[],
  today: Date,
): OverdueTask[] {
  const todayKey = toLocalDateKey(today)
  return tasks
    .filter((task) => !task.completed && task.dueDate < todayKey)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((task) => ({
      task,
      daysOverdue: calendarDaysBetween(new Date(`${task.dueDate}T12:00:00`), today),
    }))
}

export type StaleDeal = { deal: Deal; daysWithoutActivity: number }

/**
 * Otwarte szanse, w których od `staleDays` dni nic się nie wydarzyło
 * (aktywność, spotkanie lub utworzenie) — największe kwoty pierwsze.
 */
export function getStaleDeals(
  deals: readonly Deal[],
  data: {
    dealActivities: readonly DealActivity[]
    meetings: readonly Meeting[]
  },
  today: Date,
  staleDays: number = STALE_DEAL_DAYS,
): StaleDeal[] {
  const lastTouchByDeal = new Map<string, number>()
  const touch = (dealId: string, at: string) => {
    const time = new Date(at).getTime()
    if (time > today.getTime()) return
    lastTouchByDeal.set(dealId, Math.max(lastTouchByDeal.get(dealId) ?? 0, time))
  }
  for (const activity of data.dealActivities) touch(activity.dealId, activity.occurredAt)
  for (const meeting of data.meetings) {
    if (meeting.opportunityId) touch(meeting.opportunityId, meeting.startsAt)
  }

  return deals
    .filter((deal) => !isTerminalDealStatus(deal.status))
    .map((deal) => {
      const lastTouch = Math.max(
        new Date(deal.createdAt).getTime(),
        lastTouchByDeal.get(deal.id) ?? 0,
      )
      return {
        deal,
        daysWithoutActivity: calendarDaysBetween(new Date(lastTouch), today),
      }
    })
    .filter((item) => item.daysWithoutActivity > staleDays)
    .sort((a, b) => getDealAmountPln(b.deal) - getDealAmountPln(a.deal))
}

export type UpcomingRenewal = {
  product: ClientBankingProduct
  daysUntilExpiry: number
}

/** Aktywne lub wygasające produkty klienta z końcem ważności w horyzoncie. */
export function getUpcomingRenewals(
  products: readonly ClientBankingProduct[],
  today: Date,
  horizonDays: number = RENEWAL_HORIZON_DAYS,
): UpcomingRenewal[] {
  return products
    .filter(
      (product) =>
        product.expiresAt &&
        (product.status === "active" || product.status === "expiring"),
    )
    .map((product) => ({
      product,
      daysUntilExpiry: calendarDaysBetween(today, new Date(product.expiresAt!)),
    }))
    .filter(
      (item) => item.daysUntilExpiry >= 0 && item.daysUntilExpiry <= horizonDays,
    )
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
}
