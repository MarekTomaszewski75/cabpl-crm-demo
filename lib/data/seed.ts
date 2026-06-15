import clientsSeed from "@/data/clients.json"
import contactClientLinksSeed from "@/data/contact-client-links.json"
import contactEventsSeed from "@/data/contact-events.json"
import contactsSeed from "@/data/contacts.json"
import kpiSeed from "@/data/kpi.json"
import leadsSeed from "@/data/leads.json"
import leadActivitiesSeed from "@/data/lead-activities.json"
import leadDocumentsSeed from "@/data/lead-documents.json"
import dealDocumentsSeed from "@/data/deal-documents.json"
import clientDocumentsSeed from "@/data/client-documents.json"
import clientFilesSeed from "@/data/client-files.json"
import leadFilesSeed from "@/data/lead-files.json"
import dealFilesSeed from "@/data/deal-files.json"
import dealActivitiesSeed from "@/data/deal-activities.json"
import meetingsSeed from "@/data/meetings.json"
import opportunitiesSeed from "@/data/opportunities.json"
import tasksSeed from "@/data/tasks.json"
import usersSeed from "@/data/users.json"
import departmentsSeed from "@/data/departments.json"
import employeesSeed from "@/data/employees.json"
import productCategoriesSeed from "@/data/product-categories.json"
import productsSeed from "@/data/products.json"
import {
  DEFAULT_PIPELINE_CATEGORY_ID,
  getPipelineSteps,
  isPipelineCategoryId,
  mapLegacyDealStatus,
  mapLegacyOpportunityStage,
  type LegacyDealStatus,
  type PipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import type {
  Client,
  ContactClientLink,
  ContactEvent,
  CrmContact,
  DealSource,
  DemoUser,
  Department,
  Employee,
  KpiSnapshot,
  Lead,
  LeadActivity,
  LeadDocument,
  DealDocument,
  ClientDocument,
  ClientFile,
  LeadFile,
  DealFile,
  Meeting,
  Deal,
  DealActivity,
  Product,
  ProductCategory,
  Task,
} from "@/types/crm"

const DEAL_SOURCES: readonly DealSource[] = [
  "phone_call",
  "link",
  "email",
  "advertising",
  "partner",
  "recommendation",
]

function normalizeDealSource(value: unknown): DealSource {
  if (
    typeof value === "string" &&
    (DEAL_SOURCES as readonly string[]).includes(value)
  ) {
    return value as DealSource
  }
  return "recommendation"
}

function normalizeEntityFile<
  T extends { fileName: string; displayName?: string; description?: string },
>(file: T): T & { displayName: string } {
  const fileName = file.fileName.trim()
  const displayName = file.displayName?.trim() || fileName
  const description = file.description?.trim()
  return {
    ...file,
    fileName,
    displayName,
    ...(description ? { description } : {}),
  }
}

function normalizeClientFiles(files: ClientFile[]): ClientFile[] {
  return files.map((file) => normalizeEntityFile(file))
}

function normalizeLeadFiles(files: LeadFile[]): LeadFile[] {
  return files.map((file) => normalizeEntityFile(file))
}

function normalizeDealFiles(files: DealFile[]): DealFile[] {
  return files.map((file) => normalizeEntityFile(file))
}

const DEFAULT_SEED_PRODUCT_ID = "prod-001"

function resolveSeedPipelineCategoryId(
  value: unknown,
): PipelineCategoryId {
  if (typeof value === "string" && isPipelineCategoryId(value)) {
    return value
  }
  return DEFAULT_PIPELINE_CATEGORY_ID
}

/** Dev-only: walidacja statusu względem lejka kategorii (US-28). */
function assertDealPipelineStatus(deal: Deal): void {
  if (process.env.NODE_ENV !== "development") return
  if (!isPipelineCategoryId(deal.pipelineCategoryId)) return
  const steps = getPipelineSteps(deal.pipelineCategoryId)
  if (!steps.includes(deal.status)) {
    console.warn(
      `[seed] Deal ${deal.id}: status „${deal.status}” poza lejkiem ${deal.pipelineCategoryId}`,
    )
  }
  if (!deal.productId) {
    console.warn(`[seed] Deal ${deal.id}: brak productId`)
  }
}

function normalizeDealStatus(
  raw: Record<string, unknown>,
  pipelineCategoryId: PipelineCategoryId,
): Deal["status"] {
  if (typeof raw.status === "string") {
    const status = raw.status
    if (status === "new" || status === "won" || status === "lost") {
      return status
    }
    if (
      status === "association_created" ||
      status === "meeting_scheduled" ||
      status === "offer_submitted" ||
      status === "negotiation_started"
    ) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[seed] Legacy status US-18 „${status}” w ${String(raw.id)} — uruchom migrację US-28`,
        )
      }
      return mapLegacyDealStatus(
        pipelineCategoryId,
        status as LegacyDealStatus,
      )
    }
    return status as Deal["status"]
  }

  if (typeof raw.stage === "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[seed] Legacy pole stage w ${String(raw.id)} — uruchom migrację US-28`,
      )
    }
    return mapLegacyOpportunityStage(pipelineCategoryId, raw.stage)
  }

  return "new"
}

function normalizeLegacyDeal(raw: Record<string, unknown>): Deal {
  const pipelineCategoryId = resolveSeedPipelineCategoryId(
    raw.pipelineCategoryId,
  )
  const deal: Deal = {
    id: String(raw.id),
    name: String(raw.title ?? raw.name ?? ""),
    clientId: raw.clientId != null ? String(raw.clientId) : null,
    contactId: null,
    productId:
      typeof raw.productId === "string"
        ? raw.productId
        : DEFAULT_SEED_PRODUCT_ID,
    pipelineCategoryId,
    comments: "",
    source: normalizeDealSource(raw.source),
    dealType: null,
    amount:
      typeof raw.amount === "number"
        ? raw.amount
        : typeof raw.amountPln === "number"
          ? raw.amountPln
          : null,
    currency: "PLN",
    status: normalizeDealStatus(raw, pipelineCategoryId),
    lostReason: null,
    finishedByUserId: null,
    finishedAt: null,
    firstFinishedByUserId: null,
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString(),
    probability:
      typeof raw.probability === "number" ? raw.probability : undefined,
    expectedCloseDate:
      typeof raw.expectedCloseDate === "string"
        ? raw.expectedCloseDate
        : undefined,
    ownerId: String(raw.ownerId ?? ""),
    regionId: String(raw.regionId ?? ""),
  }
  assertDealPipelineStatus(deal)
  return deal
}

function normalizeDeals(raw: unknown[]): Deal[] {
  return raw.map((item) => {
    const deal = item as Record<string, unknown>
    const isLegacy =
      typeof deal.title === "string" ||
      typeof deal.stage === "string" ||
      typeof deal.amountPln === "number"

    if (isLegacy) {
      return normalizeLegacyDeal(deal)
    }

    const pipelineCategoryId = resolveSeedPipelineCategoryId(
      deal.pipelineCategoryId,
    )
    const productId =
      typeof deal.productId === "string"
        ? deal.productId
        : DEFAULT_SEED_PRODUCT_ID

    const normalized = {
      ...deal,
      productId,
      pipelineCategoryId,
      source: normalizeDealSource(deal.source),
      status: normalizeDealStatus(deal, pipelineCategoryId),
    } as Deal

    assertDealPipelineStatus(normalized)
    return normalized
  })
}

export function loadSeedData() {
  return {
    users: usersSeed as DemoUser[],
    departments: departmentsSeed as Department[],
    employees: employeesSeed as Employee[],
    contacts: contactsSeed as CrmContact[],
    contactClientLinks: contactClientLinksSeed as ContactClientLink[],
    clients: clientsSeed as Client[],
    opportunities: normalizeDeals(opportunitiesSeed as unknown[]),
    dealActivities: dealActivitiesSeed as DealActivity[],
    leads: leadsSeed as Lead[],
    leadActivities: leadActivitiesSeed as LeadActivity[],
    leadDocuments: leadDocumentsSeed as LeadDocument[],
    dealDocuments: dealDocumentsSeed as DealDocument[],
    clientDocuments: clientDocumentsSeed as ClientDocument[],
    clientFiles: normalizeClientFiles(clientFilesSeed as ClientFile[]),
    leadFiles: normalizeLeadFiles(leadFilesSeed as LeadFile[]),
    dealFiles: normalizeDealFiles(dealFilesSeed as DealFile[]),
    tasks: tasksSeed as Task[],
    meetings: meetingsSeed as Meeting[],
    contactEvents: contactEventsSeed as ContactEvent[],
    kpi: kpiSeed as KpiSnapshot,
    productCategories: productCategoriesSeed as ProductCategory[],
    products: productsSeed as Product[],
  }
}

export type DemoDataState = ReturnType<typeof loadSeedData>
