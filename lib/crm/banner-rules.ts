import { getToday, toLocalDateKey } from "@/lib/crm/local-date"
import {
  getDealsRequiringAttention,
  TODAY_PIPELINE_HORIZON_DAYS,
} from "@/lib/crm/today-pipeline-summary"
import { formatCurrencyPln, formatDatePl, formatTimePl } from "@/lib/format/pl"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  Deal,
  DemoUser,
  Meeting,
  Task,
} from "@/types/crm"

export const CRITICAL_DEAL_AMOUNT_PLN = 500_000
export const CRITICAL_DEAL_HOURS = 48

/** Wyłączone w demo — seed generuje zbyt agresywne alerty na prezentacji. */
export const AUTO_CRITICAL_DEAL_BANNER = false

export const CRITICAL_DEAL_BANNER_PRIORITY = 10
export const SYSTEM_DEMO_BANNER_PRIORITY = 0

/** Opóźnienie przed pierwszym banerem — symuluje push z systemu w tle. */
export const BANNER_INITIAL_DELAY_MS = 4_000
/** Drugi baner (inny losowy) — pokazuje kolejkowanie. */
export const BANNER_FOLLOW_UP_DELAY_MS = 11_000

/** Horyzont spotkań w banerze (dni od dziś). */
export const BANNER_MEETING_HORIZON_DAYS = 30

export type BannerVariant = "info" | "warning"

export type BannerPayload = {
  id: string
  variant: BannerVariant
  priority: number
  dismissible: boolean
  titlePl: string
  descriptionPl: string
  href?: string
  actionLabelPl?: string
}

export type BannerDataInput = {
  deals: readonly Deal[]
  tasks: readonly Task[]
  meetings: readonly Meeting[]
  clients: readonly Client[]
}

function shuffleBannerPool<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Losuje unikalne banery z puli wygenerowanej z danych. */
export function pickRandomDemoBanners(
  pool: readonly BannerPayload[],
  count: number,
  excludeIds: readonly string[] = [],
): BannerPayload[] {
  const available = pool.filter((banner) => !excludeIds.includes(banner.id))
  return shuffleBannerPool(available).slice(0, Math.min(count, available.length))
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toComparableDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10)
  return toLocalDateKey(parsed)
}

function parseDateKey(dateKey: string): Date {
  const normalized = toComparableDateKey(dateKey)
  const [year, month, day] = normalized.split("-").map(Number)
  return new Date(year, month - 1, day, 23, 59, 59, 999)
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatMeetingSchedulePl(start: Date, asOfDate: Date): string {
  const timeLabel = formatTimePl(start)
  const dateKey = toLocalDateKey(start)
  const asOfKey = toLocalDateKey(asOfDate)
  const tomorrowKey = toLocalDateKey(addCalendarDays(asOfDate, 1))

  if (dateKey === asOfKey) return `dziś o ${timeLabel}`
  if (dateKey === tomorrowKey) return `jutro o ${timeLabel}`
  return `${formatDatePl(start)} o ${timeLabel}`
}

function buildPortfolioSyncBanner(
  clients: readonly Client[],
  user: DemoUser,
  asOfDate: Date,
): BannerPayload | null {
  const scopedClients = filterByScope(clients, user)
  if (scopedClients.length === 0) return null

  const syncDate = addCalendarDays(asOfDate, -1)

  return {
    id: "sync-clients",
    variant: "info",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Aktualizacja danych klientów",
    descriptionPl: `Dane finansowe i limity kredytowe dla ${scopedClients.length} firm w Twoim portfolio zostały zsynchronizowane z systemem bankowym (${formatDatePl(syncDate)}).`,
  }
}

function buildMeetingSoonBanner(
  meetings: readonly Meeting[],
  clients: readonly Client[],
  user: DemoUser,
  asOfDate: Date,
): BannerPayload | null {
  const clientNameById = new Map(clients.map((client) => [client.id, client.name]))
  const horizonEnd = addCalendarDays(asOfDate, BANNER_MEETING_HORIZON_DAYS)

  const dayStart = startOfLocalDay(asOfDate)

  const upcoming = filterByScope(meetings, user)
    .filter((meeting) => {
      const start = new Date(meeting.startsAt)
      return start.getTime() >= dayStart.getTime() && start <= horizonEnd
    })
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )

  const meeting = upcoming[0]
  if (!meeting) return null

  const start = new Date(meeting.startsAt)
  const clientName = meeting.clientId
    ? (clientNameById.get(meeting.clientId) ?? null)
    : null
  const scheduleLabel = formatMeetingSchedulePl(start, asOfDate)

  return {
    id: `meeting-${meeting.id}`,
    variant: "info",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Nadchodzące spotkanie",
    descriptionPl: clientName
      ? `${meeting.title} z ${clientName} — ${scheduleLabel}.`
      : `${meeting.title} — ${scheduleLabel}.`,
    href: "/calendar",
    actionLabelPl: "Otwórz kalendarz",
  }
}

function buildOverdueTasksBanner(
  tasks: readonly Task[],
  user: DemoUser,
  asOfDate: Date,
): BannerPayload | null {
  const asOfKey = toLocalDateKey(asOfDate)
  const overdue = filterByScope(tasks, user)
    .filter((task) => {
      if (task.completed) return false
      return toComparableDateKey(task.dueDate) < asOfKey
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  if (overdue.length === 0) return null

  const first = overdue[0]
  const descriptionPl =
    overdue.length === 1
      ? `„${first.title}” — termin ${formatDatePl(first.dueDate)}.`
      : `${overdue.length} zadania po terminie — m.in. „${first.title}” (${formatDatePl(first.dueDate)}).`

  return {
    id: "tasks-overdue",
    variant: "warning",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Zadania po terminie",
    descriptionPl,
    href: "/tasks",
    actionLabelPl: "Zobacz zadania",
  }
}

function buildTasksDueSoonBanner(
  tasks: readonly Task[],
  user: DemoUser,
  asOfDate: Date,
): BannerPayload | null {
  const asOfKey = toLocalDateKey(asOfDate)
  const horizonKey = toLocalDateKey(addCalendarDays(asOfDate, 2))

  const dueSoon = filterByScope(tasks, user)
    .filter((task) => {
      if (task.completed) return false
      const dueKey = toComparableDateKey(task.dueDate)
      return dueKey >= asOfKey && dueKey <= horizonKey
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  if (dueSoon.length === 0) return null

  const first = dueSoon[0]
  const dueKey = toComparableDateKey(first.dueDate)
  const dueLabel =
    dueKey === asOfKey
      ? "termin dziś"
      : dueKey === toLocalDateKey(addCalendarDays(asOfDate, 1))
        ? "termin jutro"
        : `termin ${formatDatePl(first.dueDate)}`

  const descriptionPl =
    dueSoon.length === 1
      ? `„${first.title}” — ${dueLabel}.`
      : `${dueSoon.length} zadania z terminem w najbliższych dniach — m.in. „${first.title}” (${dueLabel}).`

  return {
    id: "tasks-due-soon",
    variant: "info",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Zbliżające się terminy zadań",
    descriptionPl,
    href: "/tasks",
    actionLabelPl: "Zobacz zadania",
  }
}

function buildPipelineBanners(
  deals: readonly Deal[],
  clients: readonly Client[],
  user: DemoUser,
  asOfDate: Date,
): BannerPayload[] {
  const scopedDeals = filterByScope(deals, user)
  const summaries = getDealsRequiringAttention(scopedDeals, clients, asOfDate)
  if (summaries.length === 0) return []

  const banners: BannerPayload[] = []
  const top = summaries[0]
  const daysLabel =
    top.daysUntilClose <= 0
      ? "termin dziś"
      : top.daysUntilClose === 1
        ? "termin jutro"
        : `termin za ${top.daysUntilClose} dni`

  banners.push({
    id: `pipeline-deal-${top.deal.id}`,
    variant: top.daysUntilClose <= 1 ? "warning" : "info",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Termin zamknięcia deala",
    descriptionPl: `${top.deal.name} — ${formatCurrencyPln(top.deal.amount ?? 0)} · ${daysLabel} (${formatDatePl(top.deal.expectedCloseDate!)})`,
    href: `/pipeline/${top.deal.id}`,
    actionLabelPl: "Przejdź do deala",
  })

  if (summaries.length > 1) {
    banners.push({
      id: "pipeline-summary",
      variant: "info",
      priority: SYSTEM_DEMO_BANNER_PRIORITY,
      dismissible: true,
      titlePl: "Deale wymagające uwagi",
      descriptionPl: `${summaries.length} deale w Twoim portfelu mają planowane zamknięcie w ciągu ${TODAY_PIPELINE_HORIZON_DAYS} dni.`,
      href: "/pipeline",
      actionLabelPl: "Otwórz pipeline",
    })
  }

  return banners
}

function buildKycTasksBanner(
  tasks: readonly Task[],
  clients: readonly Client[],
  user: DemoUser,
): BannerPayload | null {
  const clientNameById = new Map(clients.map((client) => [client.id, client.name]))
  const kycTasks = filterByScope(tasks, user)
    .filter(
      (task) => !task.completed && task.title.toLowerCase().includes("kyc"),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  if (kycTasks.length === 0) return null

  const first = kycTasks[0]
  const clientName = first.clientId
    ? (clientNameById.get(first.clientId) ?? null)
    : null

  const descriptionPl = clientName
    ? `${kycTasks.length === 1 ? "1 zadanie" : `${kycTasks.length} zadania`} KYC do domknięcia — m.in. ${clientName} (termin ${formatDatePl(first.dueDate)}).`
    : `${kycTasks.length === 1 ? "1 zadanie" : `${kycTasks.length} zadania`} KYC do domknięcia — termin ${formatDatePl(first.dueDate)}.`

  return {
    id: "kyc-tasks",
    variant: "warning",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Dokumentacja KYC do uzupełnienia",
    descriptionPl,
    href: first.clientId ? `/clients/${first.clientId}` : "/tasks",
    actionLabelPl: first.clientId ? "Otwórz firmę" : "Zobacz zadania",
  }
}

/** Banery wyprowadzone z seedu — tylko gdy dane spełniają reguły (brak fikcyjnych treści). */
export function generateDemoBannersForUser(
  user: DemoUser,
  data: BannerDataInput,
  asOfDate: Date = getToday(),
): BannerPayload[] {
  const banners: BannerPayload[] = []

  const sync = buildPortfolioSyncBanner(data.clients, user, asOfDate)
  if (sync) banners.push(sync)

  const meeting = buildMeetingSoonBanner(
    data.meetings,
    data.clients,
    user,
    asOfDate,
  )
  if (meeting) banners.push(meeting)

  const overdue = buildOverdueTasksBanner(data.tasks, user, asOfDate)
  if (overdue) banners.push(overdue)

  const dueSoon = buildTasksDueSoonBanner(data.tasks, user, asOfDate)
  if (dueSoon) banners.push(dueSoon)

  banners.push(
    ...buildPipelineBanners(data.deals, data.clients, user, asOfDate),
  )

  const kyc = buildKycTasksBanner(data.tasks, data.clients, user)
  if (kyc) banners.push(kyc)

  return banners
}

function hoursUntilClose(expectedCloseDate: string, asOfDate: Date): number {
  const closeAt = parseDateKey(expectedCloseDate)
  return (closeAt.getTime() - asOfDate.getTime()) / (60 * 60 * 1000)
}

function isCriticalDeal(deal: Deal, user: DemoUser, asOfDate: Date): boolean {
  if (deal.ownerId !== user.id) return false
  if (deal.status === "won" || deal.status === "lost") return false
  if (deal.amount == null || deal.amount < CRITICAL_DEAL_AMOUNT_PLN) return false
  if (!deal.expectedCloseDate) return false

  const hours = hoursUntilClose(deal.expectedCloseDate, asOfDate)
  return hours >= 0 && hours <= CRITICAL_DEAL_HOURS
}

function buildCriticalDealPayload(deal: Deal, asOfDate: Date): BannerPayload {
  const hours = hoursUntilClose(deal.expectedCloseDate!, asOfDate)
  const closeDay = startOfLocalDay(parseDateKey(deal.expectedCloseDate!))
  const asOfDay = startOfLocalDay(asOfDate)
  const daysUntil = Math.round(
    (closeDay.getTime() - asOfDay.getTime()) / (24 * 60 * 60 * 1000),
  )

  const urgencySuffix =
    daysUntil <= 0
      ? "termin dziś"
      : daysUntil === 1
        ? "termin jutro"
        : `termin za ${Math.ceil(hours / 24)} dni`

  return {
    id: `critical-deal-${deal.id}`,
    variant: "warning",
    priority: CRITICAL_DEAL_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Deal wymaga uwagi",
    descriptionPl: `${deal.name} — ${formatCurrencyPln(deal.amount!)} · ${urgencySuffix} (${formatDatePl(deal.expectedCloseDate!)})`,
    href: `/pipeline/${deal.id}`,
    actionLabelPl: "Przejdź do deala",
  }
}

export const PRODUCTS_SYNC_SESSION_KEY = "products-sync-notified"

export const PRODUCTS_SYNC_BANNER_CHANCE = 0.3

export function createProductCatalogSyncBanner(): BannerPayload {
  return {
    id: "sync-products",
    variant: "info",
    priority: SYSTEM_DEMO_BANNER_PRIORITY,
    dismissible: true,
    titlePl: "Katalog produktów zaktualizowany",
    descriptionPl: "Pobrano zmiany z systemu produktowego banku.",
  }
}

/** Los ~30% przy pierwszym wejściu na `/products` w sesji przeglądarki. */
export function shouldShowProductCatalogSyncBanner(): boolean {
  if (typeof sessionStorage === "undefined") return false
  if (sessionStorage.getItem(PRODUCTS_SYNC_SESSION_KEY)) return false
  sessionStorage.setItem(PRODUCTS_SYNC_SESSION_KEY, "1")
  return Math.random() < PRODUCTS_SYNC_BANNER_CHANCE
}

export function getCriticalDealBanner(
  deals: readonly Deal[],
  user: DemoUser,
  asOfDate: Date = getToday(),
): BannerPayload | null {
  const criticalDeals = deals
    .filter((deal) => isCriticalDeal(deal, user, asOfDate))
    .sort((a, b) => {
      const hoursA = hoursUntilClose(a.expectedCloseDate!, asOfDate)
      const hoursB = hoursUntilClose(b.expectedCloseDate!, asOfDate)
      if (hoursA !== hoursB) return hoursA - hoursB
      return (b.amount ?? 0) - (a.amount ?? 0)
    })

  const deal = criticalDeals[0]
  if (!deal) return null

  return buildCriticalDealPayload(deal, asOfDate)
}
