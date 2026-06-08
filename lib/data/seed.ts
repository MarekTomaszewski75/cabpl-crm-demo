import clientsSeed from "@/data/clients.json"
import contactEventsSeed from "@/data/contact-events.json"
import contactsSeed from "@/data/contacts.json"
import kpiSeed from "@/data/kpi.json"
import leadsSeed from "@/data/leads.json"
import leadActivitiesSeed from "@/data/lead-activities.json"
import dealActivitiesSeed from "@/data/deal-activities.json"
import meetingsSeed from "@/data/meetings.json"
import opportunitiesSeed from "@/data/opportunities.json"
import tasksSeed from "@/data/tasks.json"
import usersSeed from "@/data/users.json"
import departmentsSeed from "@/data/departments.json"
import employeesSeed from "@/data/employees.json"
import productCategoriesSeed from "@/data/product-categories.json"
import productsSeed from "@/data/products.json"
import type {
  Client,
  ContactEvent,
  CrmContact,
  DemoUser,
  Department,
  Employee,
  KpiSnapshot,
  Lead,
  LeadActivity,
  Meeting,
  Deal,
  DealActivity,
  Product,
  ProductCategory,
  Task,
} from "@/types/crm"

function mapLegacyStage(stage: string): Deal["status"] {
  switch (stage) {
    case "lead":
      return "new"
    case "qualification":
      return "association_created"
    case "offer":
      return "offer_submitted"
    case "negotiation":
      return "negotiation_started"
    case "won":
      return "won"
    case "lost":
      return "lost"
    default:
      return "new"
  }
}

function normalizeDeals(raw: unknown[]): Deal[] {
  return raw.map((item) => {
    const deal = item as Record<string, unknown>
    if (typeof deal.name === "string" && typeof deal.status === "string") {
      return deal as unknown as Deal
    }
    return {
      id: String(deal.id),
      name: String(deal.title ?? ""),
      clientId: String(deal.clientId ?? ""),
      contactId: null,
      comments: "",
      source: "recommendation",
      dealType: null,
      amount: typeof deal.amountPln === "number" ? deal.amountPln : null,
      currency: "PLN",
      status: mapLegacyStage(String(deal.stage ?? "lead")),
      lostReason: null,
      finishedByUserId: null,
      finishedAt: null,
      firstFinishedByUserId: null,
      createdAt: new Date().toISOString(),
      probability:
        typeof deal.probability === "number" ? deal.probability : undefined,
      expectedCloseDate:
        typeof deal.expectedCloseDate === "string"
          ? deal.expectedCloseDate
          : undefined,
      ownerId: String(deal.ownerId ?? ""),
      regionId: String(deal.regionId ?? ""),
    } satisfies Deal
  })
}

export function loadSeedData() {
  return {
    users: usersSeed as DemoUser[],
    departments: departmentsSeed as Department[],
    employees: employeesSeed as Employee[],
    contacts: contactsSeed as CrmContact[],
    clients: clientsSeed as Client[],
    opportunities: normalizeDeals(opportunitiesSeed as unknown[]),
    dealActivities: dealActivitiesSeed as DealActivity[],
    leads: leadsSeed as Lead[],
    leadActivities: leadActivitiesSeed as LeadActivity[],
    tasks: tasksSeed as Task[],
    meetings: meetingsSeed as Meeting[],
    contactEvents: contactEventsSeed as ContactEvent[],
    kpi: kpiSeed as KpiSnapshot,
    productCategories: productCategoriesSeed as ProductCategory[],
    products: productsSeed as Product[],
  }
}

export type DemoDataState = ReturnType<typeof loadSeedData>
