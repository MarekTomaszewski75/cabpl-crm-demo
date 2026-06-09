import {
  getPipelineWorkflowSteps,
  isPipelineCategoryId,
  isTerminalDealStatus,
} from "@/lib/crm/deal-pipeline"
import { toLocalDateKey } from "@/lib/crm/demo-today"
import type { Client, Deal, Lead, LeadActivity } from "@/types/crm"

/** Horyzont terminów deali na widoku „Dziś” (dni od daty demo). */
export const TODAY_PIPELINE_HORIZON_DAYS = 7

/** Brak aktywności leada uznawany za „stary” po tylu dniach. */
export const TODAY_LEAD_STALE_DAYS = 7

/** Lead „new” uwzględniany dopiero po tylu dniach od utworzenia. */
const TODAY_LEAD_NEW_MIN_AGE_DAYS = 3

function isDealLateWorkflowStatus(deal: Deal): boolean {
  if (isTerminalDealStatus(deal.status)) return false
  const categoryId = isPipelineCategoryId(deal.pipelineCategoryId)
    ? deal.pipelineCategoryId
    : "pcat-credit"
  const workflow = getPipelineWorkflowSteps(categoryId)
  const index = workflow.indexOf(deal.status)
  if (index < 0) return false
  return index >= workflow.length - 2
}

export type TodayDealSummary = {
  deal: Deal
  clientName: string | null
  daysUntilClose: number
}

export type TodayLeadSummary = {
  lead: Lead
  daysSinceLastActivity: number
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Normalizuje datę seedu lub ISO do klucza `YYYY-MM-DD` (porównania leksykograficzne). */
function toComparableDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.slice(0, 10)
  return toLocalDateKey(parsed)
}

function parseDateKey(dateKey: string): Date {
  const normalized = toComparableDateKey(dateKey)
  const [year, month, day] = normalized.split("-").map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

function calendarDaysBetween(earlier: Date, later: Date): number {
  const start = startOfLocalDay(earlier)
  const end = startOfLocalDay(later)
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function getLastActivityAt(
  lead: Lead,
  leadActivities: readonly LeadActivity[],
): Date {
  const forLead = leadActivities.filter((activity) => activity.leadId === lead.id)
  if (forLead.length === 0) {
    return new Date(lead.createdAt)
  }
  const latest = forLead.reduce((max, activity) =>
    activity.occurredAt > max ? activity.occurredAt : max,
  forLead[0].occurredAt)
  return new Date(latest)
}

function isLeadEligibleStatus(lead: Lead, asOfDate: Date): boolean {
  if (lead.status === "in_progress") return true
  if (lead.status === "new") {
    return (
      calendarDaysBetween(new Date(lead.createdAt), asOfDate) >
      TODAY_LEAD_NEW_MIN_AGE_DAYS
    )
  }
  return false
}

export function getDealsRequiringAttention(
  deals: readonly Deal[],
  clients: readonly Client[],
  asOfDate: Date,
): TodayDealSummary[] {
  const asOfKey = toLocalDateKey(asOfDate)
  const horizonEndKey = toLocalDateKey(
    addCalendarDays(asOfDate, TODAY_PIPELINE_HORIZON_DAYS),
  )
  const clientNameById = new Map(clients.map((client) => [client.id, client.name]))

  return deals
    .filter((deal) => {
      if (!isDealLateWorkflowStatus(deal)) return false
      if (!deal.expectedCloseDate) return false
      const closeKey = toComparableDateKey(deal.expectedCloseDate)
      return closeKey >= asOfKey && closeKey <= horizonEndKey
    })
    .map((deal) => ({
      deal,
      clientName: deal.clientId
        ? (clientNameById.get(deal.clientId) ?? null)
        : null,
      daysUntilClose: calendarDaysBetween(
        asOfDate,
        parseDateKey(deal.expectedCloseDate!),
      ),
    }))
    .sort((a, b) => {
      const dateDiff = toComparableDateKey(a.deal.expectedCloseDate!).localeCompare(
        toComparableDateKey(b.deal.expectedCloseDate!),
      )
      if (dateDiff !== 0) return dateDiff
      return (b.deal.amount ?? 0) - (a.deal.amount ?? 0)
    })
}

export function getLeadsRequiringAttention(
  leads: readonly Lead[],
  leadActivities: readonly LeadActivity[],
  asOfDate: Date,
): TodayLeadSummary[] {
  return leads
    .filter((lead) => {
      if (!isLeadEligibleStatus(lead, asOfDate)) return false
      const lastActivityAt = getLastActivityAt(lead, leadActivities)
      return (
        calendarDaysBetween(lastActivityAt, asOfDate) >= TODAY_LEAD_STALE_DAYS
      )
    })
    .map((lead) => {
      const lastActivityAt = getLastActivityAt(lead, leadActivities)
      return {
        lead,
        daysSinceLastActivity: calendarDaysBetween(lastActivityAt, asOfDate),
      }
    })
    .sort((a, b) => {
      const dateA = getLastActivityAt(a.lead, leadActivities).getTime()
      const dateB = getLastActivityAt(b.lead, leadActivities).getTime()
      return dateA - dateB
    })
}
