import { isChannelContactEvent } from "@/lib/crm/contact-event-utils"
import { DEAL_STATUS_LABELS } from "@/lib/crm/deal-labels"
import type { Client, ContactEvent, Deal } from "@/types/crm"

export type NbaSuggestionKind = "no_contact" | "stale_opportunity"

export type NbaSuggestionPriority = "high" | "medium"

export interface NbaSuggestion {
  id: string
  kind: NbaSuggestionKind
  priority: NbaSuggestionPriority
  message: string
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const DEFAULT_NO_CONTACT_DAYS = 30
const DEFAULT_STALE_OPPORTUNITY_DAYS = 14
const MAX_SUGGESTIONS = 3

function daysBetween(earlier: Date, later: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / MS_PER_DAY)
}

function getLastContactAt(
  client: Client,
  contactEvents: readonly ContactEvent[],
): Date {
  const clientEvents = contactEvents.filter(
    (e) => e.clientId === client.id && isChannelContactEvent(e),
  )
  if (clientEvents.length === 0) {
    return new Date(client.lastActivityAt)
  }
  const latest = clientEvents.reduce((max, event) => {
    const at = new Date(event.occurredAt)
    return at > max ? at : max
  }, new Date(clientEvents[0]!.occurredAt))
  return latest
}

function isActiveOpportunity(opportunity: Deal): boolean {
  return opportunity.status !== "won" && opportunity.status !== "lost"
}

export type GetClientNbaSuggestionsInput = {
  client: Client
  opportunities: readonly Deal[]
  contactEvents: readonly ContactEvent[]
  now?: Date
  noContactDays?: number
  staleOpportunityDays?: number
}

/**
 * Statyczne reguły NBA na karcie klienta (demo Etap 1).
 * Czyste funkcje — rozszerzalne w US-11 (leady, karta szansy).
 */
export function getClientNbaSuggestions({
  client,
  opportunities,
  contactEvents,
  now = new Date(),
  noContactDays = DEFAULT_NO_CONTACT_DAYS,
  staleOpportunityDays = DEFAULT_STALE_OPPORTUNITY_DAYS,
}: GetClientNbaSuggestionsInput): NbaSuggestion[] {
  const suggestions: NbaSuggestion[] = []
  const lastContactAt = getLastContactAt(client, contactEvents)
  const daysSinceContact = daysBetween(lastContactAt, now)

  if (daysSinceContact > noContactDays) {
    suggestions.push({
      id: `${client.id}-no-contact`,
      kind: "no_contact",
      priority: "high",
      message: `Brak kontaktu z klientem od ponad ${noContactDays} dni — zaplanuj telefon lub spotkanie.`,
    })
  }

  const activeDeals = opportunities.filter(
    (opp) => opp.clientId === client.id && isActiveOpportunity(opp),
  )

  for (const opportunity of activeDeals) {
    if (daysSinceContact <= staleOpportunityDays) {
      continue
    }
    const stageLabel = DEAL_STATUS_LABELS[opportunity.status]
    suggestions.push({
      id: `${opportunity.id}-stale`,
      kind: "stale_opportunity",
      priority: "medium",
      message: `Deal „${opportunity.name}” (${stageLabel}) — brak aktualizacji kontaktu od ${daysSinceContact} dni.`,
    })
    if (suggestions.length >= MAX_SUGGESTIONS) {
      break
    }
  }

  return suggestions.slice(0, MAX_SUGGESTIONS)
}

export type GetOpportunityNbaSuggestionsInput = {
  opportunity: Deal
  client: Client
  opportunities: readonly Deal[]
  contactEvents: readonly ContactEvent[]
  now?: Date
  noContactDays?: number
  staleOpportunityDays?: number
}

/**
 * Sugestie NBA dla pojedynczej szansy (karta na kliencie / lejku) — reuse reguł klienta.
 */
export function getOpportunityNbaSuggestions({
  opportunity,
  client,
  opportunities,
  contactEvents,
  now,
  noContactDays,
  staleOpportunityDays,
}: GetOpportunityNbaSuggestionsInput): NbaSuggestion[] {
  const clientSuggestions = getClientNbaSuggestions({
    client,
    opportunities,
    contactEvents,
    now,
    noContactDays,
    staleOpportunityDays,
  })

  return clientSuggestions
    .filter((suggestion) => {
      if (suggestion.kind === "no_contact") {
        return true
      }
      return suggestion.id === `${opportunity.id}-stale`
    })
    .slice(0, 2)
}
