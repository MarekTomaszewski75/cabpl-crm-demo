import { formatContactName } from "@/lib/crm/contact-display"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  ContactClientLink,
  ContactCompanyBinding,
  ContactCompanyBindingSource,
  CrmContact,
  Deal,
  DemoUser,
  EnrichedContactRow,
  Lead,
} from "@/types/crm"

export const CONTACT_BINDING_DEAL_FALLBACK_LABEL = "Kontakt deala"

export type ContactBindingsData = {
  clients: readonly Client[]
  contacts: readonly CrmContact[]
  deals: readonly Deal[]
  leads: readonly Lead[]
  contactClientLinks: readonly ContactClientLink[]
}

const SOURCE_PRIORITY: Record<ContactCompanyBindingSource, number> = {
  company: 3,
  lead: 2,
  deal: 1,
}

function findLinkRole(
  links: readonly ContactClientLink[],
  contactId: string,
  clientId: string,
): string {
  return (
    links.find(
      (link) => link.contactId === contactId && link.clientId === clientId,
    )?.roleAtCompany ?? ""
  )
}

function resolveDealLeadRole(
  linkRole: string,
  leadPosition?: string,
): string {
  const trimmedLinkRole = linkRole.trim()
  if (trimmedLinkRole) return trimmedLinkRole
  const trimmedLeadPosition = leadPosition?.trim()
  if (trimmedLeadPosition) return trimmedLeadPosition
  return CONTACT_BINDING_DEAL_FALLBACK_LABEL
}

function bindingRoleScore(role: string): number {
  const trimmed = role.trim()
  if (!trimmed) return 0
  if (trimmed === CONTACT_BINDING_DEAL_FALLBACK_LABEL) return 1
  return 3
}

function mergeBindingsGroup(
  bindings: ContactCompanyBinding[],
): ContactCompanyBinding {
  return [...bindings].sort((a, b) => {
    const scoreDiff =
      bindingRoleScore(b.roleAtCompany) - bindingRoleScore(a.roleAtCompany)
    if (scoreDiff !== 0) return scoreDiff
    return SOURCE_PRIORITY[b.source] - SOURCE_PRIORITY[a.source]
  })[0]
}

function groupBindings(
  raw: ContactCompanyBinding[],
): ContactCompanyBinding[] {
  const grouped = new Map<string, ContactCompanyBinding[]>()
  for (const binding of raw) {
    const key = `${binding.contactId}:${binding.clientId}`
    const existing = grouped.get(key) ?? []
    existing.push(binding)
    grouped.set(key, existing)
  }
  return [...grouped.values()].map(mergeBindingsGroup)
}

export function getContactCompanyBindingsForClient(
  clientId: string,
  data: ContactBindingsData,
  user: DemoUser,
): ContactCompanyBinding[] {
  const client = data.clients.find((entry) => entry.id === clientId)
  if (!client) return []

  const raw: ContactCompanyBinding[] = []

  for (const contactId of client.contactIds) {
    raw.push({
      contactId,
      clientId,
      roleAtCompany: findLinkRole(data.contactClientLinks, contactId, clientId),
      source: "company",
    })
  }

  for (const deal of filterByScope(data.deals, user)) {
    if (deal.clientId !== clientId || !deal.contactId) continue
    const linkRole = findLinkRole(
      data.contactClientLinks,
      deal.contactId,
      clientId,
    )
    raw.push({
      contactId: deal.contactId,
      clientId,
      roleAtCompany: resolveDealLeadRole(linkRole),
      source: "deal",
      sourceEntityId: deal.id,
    })
  }

  for (const lead of filterByScope(data.leads, user)) {
    if (lead.clientId !== clientId || !lead.contactId) continue
    const linkRole = findLinkRole(
      data.contactClientLinks,
      lead.contactId,
      clientId,
    )
    raw.push({
      contactId: lead.contactId,
      clientId,
      roleAtCompany: resolveDealLeadRole(linkRole, lead.position),
      source: "lead",
      sourceEntityId: lead.id,
    })
  }

  return groupBindings(raw)
}

export function getContactsForClient(
  clientId: string,
  data: ContactBindingsData,
  user: DemoUser,
): EnrichedContactRow[] {
  const bindings = getContactCompanyBindingsForClient(clientId, data, user)
  const contactMap = new Map(data.contacts.map((contact) => [contact.id, contact]))

  const rows: EnrichedContactRow[] = []
  const seen = new Set<string>()

  for (const binding of bindings) {
    if (seen.has(binding.contactId)) continue
    seen.add(binding.contactId)
    const contact = contactMap.get(binding.contactId)
    if (!contact) continue
    rows.push({
      contact,
      bindings: bindings.filter(
        (entry) => entry.contactId === binding.contactId,
      ),
    })
  }

  return rows.sort((a, b) =>
    formatContactName(a.contact).localeCompare(
      formatContactName(b.contact),
      "pl",
    ),
  )
}

export function getScopedContacts(
  user: DemoUser,
  data: ContactBindingsData,
): EnrichedContactRow[] {
  const scopedClients = filterByScope(data.clients, user)
  const bindingsByContact = new Map<string, ContactCompanyBinding[]>()

  for (const client of scopedClients) {
    const bindings = getContactCompanyBindingsForClient(client.id, data, user)
    for (const binding of bindings) {
      const existing = bindingsByContact.get(binding.contactId) ?? []
      const alreadyLinked = existing.some(
        (entry) => entry.clientId === binding.clientId,
      )
      if (!alreadyLinked) {
        existing.push(binding)
      }
      bindingsByContact.set(binding.contactId, existing)
    }
  }

  const contactMap = new Map(data.contacts.map((contact) => [contact.id, contact]))
  const rows: EnrichedContactRow[] = []

  for (const [contactId, bindings] of bindingsByContact) {
    const contact = contactMap.get(contactId)
    if (!contact) continue
    rows.push({ contact, bindings })
  }

  return rows.sort((a, b) =>
    formatContactName(a.contact).localeCompare(
      formatContactName(b.contact),
      "pl",
    ),
  )
}

export function isContactInUserScope(
  contactId: string,
  user: DemoUser,
  data: ContactBindingsData,
): boolean {
  return getScopedContacts(user, data).some(
    (row) => row.contact.id === contactId,
  )
}
