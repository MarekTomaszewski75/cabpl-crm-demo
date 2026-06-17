import { createNextClientId } from "@/lib/crm/client-id"
import { createNextContactId } from "@/lib/crm/contact-id"
import { createNextOpportunityId } from "@/lib/crm/opportunity-id"
import { resolvePipelineCategoryId } from "@/lib/crm/deal-pipeline"
import type {
  Client,
  CrmContact,
  Lead,
  Deal,
  Product,
} from "@/types/crm"

export type WinLeadResult = {
  opportunity: Deal
  leadPatch: Pick<Lead, "status" | "clientId" | "opportunityId" | "contactId">
  newClient?: Client
  newContact?: CrmContact
}

function buildProspectClient(
  lead: Lead,
  existingClients: readonly Client[],
): Client {
  const id = createNextClientId(existingClients)
  const firmName = lead.companyName.trim() || lead.name.trim()
  const now = new Date().toISOString()
  return {
    id,
    name: firmName,
    nip: `999-${id.replace("client-", "")}-00-00`,
    segment: "Prospect (lead)",
    phones: [...lead.phones],
    emails: [...lead.emails],
    contactIds: lead.contactId ? [lead.contactId] : [],
    comments: lead.comments,
    source: lead.source === "advertising" ? "partner" : lead.source,
    companyType: "potential_client",
    address: "",
    website: "",
    socialMedia: lead.socialMedia,
    ownerId: lead.ownerId,
    regionId: lead.regionId,
    lastActivityAt: lead.createdAt || now,
  }
}

function buildContactFromLead(
  lead: Lead,
  existingContacts: readonly CrmContact[],
): CrmContact | undefined {
  const email = lead.emails[0]?.trim()
  const phone = lead.phones[0]?.trim()
  if (!email && !phone) return undefined

  const nameParts = lead.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? "Kontakt"
  const lastName = nameParts.slice(1).join(" ") || "z leada"

  return {
    id: createNextContactId(existingContacts),
    firstName,
    lastName,
    emails: email ? [email] : [],
    phones: phone ? [phone] : [],
  }
}

function buildDealName(productName: string, leadName: string): string {
  return `${productName} — ${leadName.trim()}`
}

export function buildWinLeadResult(
  lead: Lead,
  input: {
    productId: string
    createContactFromLead?: boolean
    existingOpportunities: readonly Deal[]
    existingClients: readonly Client[]
    existingContacts: readonly CrmContact[]
    products: readonly Product[]
    now?: Date
  },
): WinLeadResult {
  const product = input.products.find((item) => item.id === input.productId)
  if (!product) {
    throw new Error(`Nieznany produkt: ${input.productId}`)
  }

  const now = (input.now ?? new Date()).toISOString()
  let clientId = lead.clientId
  let newClient: Client | undefined
  let newContact: CrmContact | undefined
  let contactId = lead.contactId

  if (clientId === null) {
    newClient = buildProspectClient(lead, input.existingClients)
    clientId = newClient.id
  }

  if (contactId === null && input.createContactFromLead) {
    newContact = buildContactFromLead(lead, input.existingContacts)
    if (newContact) {
      contactId = newContact.id
      if (newClient && contactId) {
        newClient = { ...newClient, contactIds: [contactId] }
      }
    }
  }

  const pipelineCategoryId = resolvePipelineCategoryId(product.categoryId)

  const opportunity: Deal = {
    id: createNextOpportunityId(input.existingOpportunities),
    name: buildDealName(product.name, lead.name),
    clientId: clientId!,
    contactId,
    productId: product.id,
    pipelineCategoryId,
    comments: lead.comments,
    source: lead.source,
    dealType: null,
    amount: 250_000,
    currency: "PLN",
    status: "new",
    lostReason: null,
    finishedByUserId: null,
    finishedAt: null,
    firstFinishedByUserId: null,
    createdAt: now,
    ownerId: lead.ownerId,
    regionId: lead.regionId,
    bankAccountId: null,
  }

  return {
    opportunity,
    leadPatch: {
      status: "won",
      clientId,
      opportunityId: opportunity.id,
      contactId: contactId ?? lead.contactId,
    },
    newClient: lead.clientId === null ? newClient : undefined,
    newContact,
  }
}
