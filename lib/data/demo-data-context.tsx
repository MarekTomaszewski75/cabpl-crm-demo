"use client"

import * as React from "react"
import { loadSeedData, type DemoDataState } from "@/lib/data/seed"
import { createNextLeadActivityId } from "@/lib/crm/lead-activity-id"
import { resolveLeadActivityKind } from "@/lib/crm/lead-activity"
import { createNextDealActivityId } from "@/lib/crm/deal-activity-id"
import { resolveDealActivityKind } from "@/lib/crm/deal-activity"
import { LEAD_LOST_REASON_LABELS } from "@/lib/crm/lead-labels"
import { DEAL_LOST_REASON_LABELS } from "@/lib/crm/deal-labels"
import {
  buildWinLeadResult,
} from "@/lib/crm/win-lead"
import { createNextClientId } from "@/lib/crm/client-id"
import { createNextContactId } from "@/lib/crm/contact-id"
import { createNextContactEventId } from "@/lib/crm/contact-event-id"
import { createNextOpportunityId } from "@/lib/crm/opportunity-id"
import { createNextProductId } from "@/lib/crm/product-id"
import {
  isDealWorkflowStatus,
  isPipelineCategoryId,
  isTerminalDealStatus,
  resolvePipelineCategoryId,
} from "@/lib/crm/deal-pipeline"
import {
  isDealWorkflowStatusChange,
  requiresDealFinishDialog,
} from "@/lib/crm/deal-status-transition"
import type {
  AddClientInput,
  AddDealInput,
  AddProductInput,
  AddCompanyActivityInput,
  AddCrmContactInput,
  Client,
  ContactEvent,
  CrmContact,
  DemoUser,
  Department,
  Employee,
  AddDealActivityInput,
  AddLeadActivityInput,
  Lead,
  LeadActivity,
  LeadSystemActivityType,
  LeadLostReason,
  LeadStatus,
  Deal,
  DealActivity,
  DealLostReason,
  DealStatus,
  DealSystemActivityType,
  Meeting,
  Product,
  ProductCategory,
  Task,
} from "@/types/crm"

function trimNonEmpty(values: string[]): string[] {
  return values.map((v) => v.trim()).filter(Boolean)
}

function buildCompanyCreatedEvent(
  client: Client,
  user: DemoUser,
  existingEvents: readonly ContactEvent[],
  occurredAt: string,
): ContactEvent {
  return {
    id: createNextContactEventId(existingEvents),
    clientId: client.id,
    kind: "system",
    type: "company_created",
    titlePl: "Utworzono firmę",
    occurredAt,
    note: client.name,
    ownerId: user.id,
    regionId: user.regionId ?? client.regionId,
  }
}

type DemoDataContextValue = DemoDataState & {
  deals: Deal[]
  addDeal: (input: AddDealInput) => Deal
  updateDeal: (id: string, patch: Partial<Deal>) => void
  winDeal: (id: string, user: DemoUser) => void
  loseDeal: (id: string, reason: DealLostReason, user: DemoUser) => void
  addDealActivity: (
    dealId: string,
    type: DealSystemActivityType,
    user: DemoUser,
    options?: { note?: string; occurredAt?: string },
  ) => void
  addDealNote: (dealId: string, note: string, user: DemoUser) => void
  addDealChannelActivity: (
    dealId: string,
    input: AddDealActivityInput,
    user: DemoUser,
  ) => void
  updateOpportunity: (
    id: string,
    patch: Partial<Deal>,
  ) => void
  addTask: (task: Task) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  addMeeting: (meeting: Meeting) => void
  addOpportunity: (opportunity: Deal) => void
  addClient: (input: AddClientInput, user: DemoUser) => Client
  updateClient: (id: string, patch: Partial<Client>) => void
  addContact: (input: AddCrmContactInput) => CrmContact
  addCompanyNote: (clientId: string, note: string, user: DemoUser) => void
  addCompanyActivity: (
    clientId: string,
    input: AddCompanyActivityInput,
    user: DemoUser,
  ) => void
  addLead: (lead: Lead, creator?: DemoUser) => void
  updateLead: (id: string, patch: Partial<Lead>) => void
  addLeadActivity: (
    leadId: string,
    type: LeadSystemActivityType,
    user: DemoUser,
    options?: { note?: string; occurredAt?: string },
  ) => void
  addLeadChannelActivity: (
    leadId: string,
    input: AddLeadActivityInput,
    user: DemoUser,
  ) => void
  addLeadNote: (leadId: string, note: string, user: DemoUser) => void
  winLead: (
    leadId: string,
    params: {
      productId: string
      createContactFromLead?: boolean
      user: DemoUser
    },
  ) => Deal | null
  loseLead: (leadId: string, reason: LeadLostReason, user: DemoUser) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, patch: Partial<Employee>) => void
  addDepartment: (department: Department) => void
  updateDepartment: (id: string, patch: Partial<Department>) => void
  removeDepartment: (id: string) => { ok: true } | { ok: false; reason: string }
  addProduct: (input: AddProductInput) => Product
  updateProduct: (id: string, patch: Partial<Product>) => void
}

const DemoDataContext = React.createContext<DemoDataContextValue | null>(null)

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoDataState>(() => loadSeedData())

  const applyDealPatch = React.useCallback(
    (deal: Deal, patch: Partial<Deal>, products: readonly Product[]): Partial<Deal> => {
      const next: Partial<Deal> = { ...patch }

      if ("productId" in patch && patch.productId !== deal.productId) {
        if (deal.status !== "new") {
          delete next.productId
          delete next.pipelineCategoryId
        } else if (patch.productId) {
          const product = products.find((item) => item.id === patch.productId)
          if (product) {
            next.pipelineCategoryId = resolvePipelineCategoryId(
              product.categoryId,
            )
          }
        }
      }

      if ("status" in patch && patch.status && patch.status !== deal.status) {
        const categoryId =
          next.pipelineCategoryId ?? deal.pipelineCategoryId
        const newStatus = patch.status
        const categoryOk = isPipelineCategoryId(categoryId)
        const allowed =
          categoryOk &&
          !isTerminalDealStatus(deal.status) &&
          (isDealWorkflowStatusChange(deal.status, newStatus, categoryId) ||
            (requiresDealFinishDialog(newStatus) &&
              isDealWorkflowStatus(deal.status, categoryId)))
        if (!allowed) {
          delete next.status
        }
      }

      return next
    },
    [],
  )

  const updateOpportunity = React.useCallback(
    (id: string, patch: Partial<Deal>) => {
      setState((prev) => ({
        ...prev,
        opportunities: prev.opportunities.map((opp) => {
          if (opp.id !== id) return opp
          const safePatch = applyDealPatch(opp, patch, prev.products)
          return { ...opp, ...safePatch }
        }),
      }))
    },
    [applyDealPatch],
  )

  const addDeal = React.useCallback(
    (input: AddDealInput) => {
      if (!input.productId?.trim()) {
        throw new Error("addDeal wymaga productId (US-28).")
      }
      let created: Deal | null = null
      setState((prev) => {
        const product = prev.products.find((item) => item.id === input.productId)
        if (!product) {
          throw new Error(`Nieznany produkt: ${input.productId}`)
        }
        const pipelineCategoryId = resolvePipelineCategoryId(product.categoryId)
        const now = new Date().toISOString()
        const deal: Deal = {
          id: createNextOpportunityId(prev.opportunities),
          name: input.name.trim(),
          amount: input.amount,
          currency: input.currency,
          contactId: input.contactId,
          productId: input.productId,
          pipelineCategoryId,
          comments: input.comments.trim(),
          source: input.source,
          dealType: input.dealType,
          status: "new",
          clientId: null,
          lostReason: null,
          finishedByUserId: null,
          finishedAt: null,
          firstFinishedByUserId: null,
          createdAt: now,
          ownerId: input.ownerId,
          regionId: input.regionId,
        }
        created = deal
        return {
          ...prev,
          opportunities: [...prev.opportunities, deal],
        }
      })
      return created!
    },
    [],
  )

  const updateDeal = React.useCallback((id: string, patch: Partial<Deal>) => {
    updateOpportunity(id, patch)
  }, [updateOpportunity])

  const addTask = React.useCallback((task: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }))
  }, [])

  const updateTask = React.useCallback((id: string, patch: Partial<Task>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, ...patch } : task,
      ),
    }))
  }, [])

  const addMeeting = React.useCallback((meeting: Meeting) => {
    setState((prev) => ({
      ...prev,
      meetings: [...prev.meetings, meeting],
    }))
  }, [])

  const addOpportunity = React.useCallback((opportunity: Deal) => {
    if (!opportunity.productId?.trim()) {
      throw new Error("addOpportunity wymaga productId (US-28).")
    }
    setState((prev) => {
      const product = prev.products.find(
        (item) => item.id === opportunity.productId,
      )
      const pipelineCategoryId = product
        ? resolvePipelineCategoryId(product.categoryId)
        : opportunity.pipelineCategoryId
      const deal: Deal = {
        ...opportunity,
        pipelineCategoryId,
        status: opportunity.status ?? "new",
      }
      return {
        ...prev,
        opportunities: [...prev.opportunities, deal],
      }
    })
  }, [])

  const addClient = React.useCallback((input: AddClientInput, user: DemoUser) => {
    const now = new Date().toISOString()
    const regionId = user.regionId
    if (!regionId) {
      throw new Error("Użytkownik bez regionu nie może utworzyć firmy w demo.")
    }

    let created: Client | null = null
    setState((prev) => {
      const client: Client = {
        id: createNextClientId(prev.clients),
        name: input.name.trim(),
        nip: (input.nip ?? "").trim(),
        segment: "",
        phones: trimNonEmpty(input.phones),
        emails: trimNonEmpty(input.emails),
        contactIds: [...input.contactIds],
        comments: input.comments.trim(),
        source: input.source,
        companyType: input.companyType,
        address: input.address.trim(),
        website: (input.website ?? "").trim(),
        socialMedia: (input.socialMedia ?? "").trim(),
        ownerId: user.id,
        regionId,
        lastActivityAt: now,
      }
      created = client
      const creationEvent = buildCompanyCreatedEvent(
        client,
        user,
        prev.contactEvents,
        now,
      )
      return {
        ...prev,
        clients: [...prev.clients, client],
        contactEvents: [...prev.contactEvents, creationEvent],
      }
    })
    return created!
  }, [])

  const updateClient = React.useCallback((id: string, patch: Partial<Client>) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((client) => {
        if (client.id !== id) return client
        const next = { ...client, ...patch }
        if (patch.phones) next.phones = trimNonEmpty(patch.phones)
        if (patch.emails) next.emails = trimNonEmpty(patch.emails)
        const hasContentChange = Object.keys(patch).some(
          (key) => key !== "lastActivityAt",
        )
        if (hasContentChange) {
          next.lastActivityAt = new Date().toISOString()
        }
        return next
      }),
    }))
  }, [])

  const addContact = React.useCallback((input: AddCrmContactInput) => {
    let created: CrmContact | null = null
    setState((prev) => {
      const contact: CrmContact = {
        id: createNextContactId(prev.contacts),
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        emails: trimNonEmpty(input.emails ?? []),
        phones: trimNonEmpty(input.phones ?? []),
      }
      created = contact
      return { ...prev, contacts: [...prev.contacts, contact] }
    })
    return created!
  }, [])

  const addCompanyNote = React.useCallback(
    (clientId: string, note: string, user: DemoUser) => {
      const trimmed = note.trim()
      if (!trimmed) return
      const now = new Date().toISOString()
      const regionId = user.regionId
      if (!regionId) return

      setState((prev) => {
        const event: ContactEvent = {
          id: createNextContactEventId(prev.contactEvents),
          clientId,
          kind: "note",
          type: "note",
          occurredAt: now,
          note: trimmed,
          ownerId: user.id,
          regionId,
        }
        return {
          ...prev,
          contactEvents: [...prev.contactEvents, event],
          clients: prev.clients.map((c) =>
            c.id === clientId ? { ...c, lastActivityAt: now } : c,
          ),
        }
      })
    },
    [],
  )

  const addCompanyActivity = React.useCallback(
    (clientId: string, input: AddCompanyActivityInput, user: DemoUser) => {
      const regionId = user.regionId
      if (!regionId) return
      const { occurredAt } = input

      setState((prev) => {
        const event: ContactEvent = {
          id: createNextContactEventId(prev.contactEvents),
          clientId,
          kind: "channel",
          type: input.type,
          titlePl: input.title,
          occurredAt,
          note: input.note,
          ownerId: input.responsibleUserId ?? user.id,
          regionId,
          ...(input.responsibleUserId
            ? { responsibleUserId: input.responsibleUserId }
            : {}),
          ...(input.participantUserIds?.length
            ? { participantUserIds: input.participantUserIds }
            : {}),
          ...(input.participantContactIds?.length
            ? { participantContactIds: input.participantContactIds }
            : {}),
        }
        return {
          ...prev,
          contactEvents: [...prev.contactEvents, event],
          clients: prev.clients.map((c) =>
            c.id === clientId ? { ...c, lastActivityAt: occurredAt } : c,
          ),
        }
      })
    },
    [],
  )

  const appendLeadActivity = React.useCallback(
    (
      prev: DemoDataState,
      leadId: string,
      user: DemoUser,
      type: LeadSystemActivityType,
      titlePl: string,
      note: string,
      occurredAt: string,
    ): LeadActivity => {
      const regionId = user.regionId
      if (!regionId) {
        throw new Error("Użytkownik bez regionu nie może dodać aktywności leada.")
      }
      return {
        id: createNextLeadActivityId(prev.leadActivities),
        leadId,
        kind: resolveLeadActivityKind(type),
        type,
        titlePl,
        note,
        occurredAt,
        ownerId: user.id,
        regionId,
      }
    },
    [],
  )

  const appendDealActivity = React.useCallback(
    (
      prev: DemoDataState,
      dealId: string,
      user: DemoUser,
      type: DealSystemActivityType,
      titlePl: string,
      note: string,
      occurredAt: string,
    ): DealActivity => {
      const regionId = user.regionId
      if (!regionId) {
        throw new Error("Użytkownik bez regionu nie może dodać aktywności deala.")
      }
      return {
        id: createNextDealActivityId(prev.dealActivities),
        dealId,
        kind: resolveDealActivityKind(type),
        type,
        titlePl,
        note,
        occurredAt,
        ownerId: user.id,
        regionId,
      }
    },
    [],
  )

  const addDealActivity = React.useCallback(
    (
      dealId: string,
      type: DealSystemActivityType,
      user: DemoUser,
      options?: { note?: string; occurredAt?: string },
    ) => {
      const titles: Record<DealSystemActivityType, string> = {
        deal_created: "Utworzono deal",
        deal_status_changed: "Zmiana statusu deala",
        deal_won: "Deal wygrany",
        deal_lost: "Deal utracony",
        deal_note: "Notatka",
      }
      const now = options?.occurredAt ?? new Date().toISOString()
      setState((prev) => {
        const activity = appendDealActivity(
          prev,
          dealId,
          user,
          type,
          titles[type],
          options?.note ?? "",
          now,
        )
        return { ...prev, dealActivities: [...prev.dealActivities, activity] }
      })
    },
    [appendDealActivity],
  )

  const addDealNote = React.useCallback(
    (dealId: string, note: string, user: DemoUser) => {
      const trimmed = note.trim()
      if (!trimmed) return
      addDealActivity(dealId, "deal_note", user, { note: trimmed })
    },
    [addDealActivity],
  )

  const addDealChannelActivity = React.useCallback(
    (dealId: string, input: AddDealActivityInput, user: DemoUser) => {
      const regionId = user.regionId
      if (!regionId) return

      setState((prev) => {
        const activity: DealActivity = {
          id: createNextDealActivityId(prev.dealActivities),
          dealId,
          kind: "channel",
          type: input.type,
          titlePl: input.title,
          occurredAt: input.occurredAt,
          note: input.note,
          ownerId: input.responsibleUserId ?? user.id,
          regionId,
          priority: input.priority,
          ...(input.responsibleUserId
            ? { responsibleUserId: input.responsibleUserId }
            : {}),
          ...(input.participantUserIds?.length
            ? { participantUserIds: input.participantUserIds }
            : {}),
          ...(input.participantContactIds?.length
            ? { participantContactIds: input.participantContactIds }
            : {}),
        }
        return {
          ...prev,
          dealActivities: [...prev.dealActivities, activity],
        }
      })
    },
    [],
  )

  const addLeadChannelActivity = React.useCallback(
    (leadId: string, input: AddLeadActivityInput, user: DemoUser) => {
      const regionId = user.regionId
      if (!regionId) return

      setState((prev) => {
        const activity: LeadActivity = {
          id: createNextLeadActivityId(prev.leadActivities),
          leadId,
          kind: "channel",
          type: input.type,
          titlePl: input.title,
          occurredAt: input.occurredAt,
          note: input.note,
          ownerId: input.responsibleUserId ?? user.id,
          regionId,
          priority: input.priority,
          ...(input.responsibleUserId
            ? { responsibleUserId: input.responsibleUserId }
            : {}),
          ...(input.participantUserIds?.length
            ? { participantUserIds: input.participantUserIds }
            : {}),
          ...(input.participantContactIds?.length
            ? { participantContactIds: input.participantContactIds }
            : {}),
        }
        return {
          ...prev,
          leadActivities: [...prev.leadActivities, activity],
        }
      })
    },
    [],
  )

  const addLeadActivity = React.useCallback(
    (
      leadId: string,
      type: LeadSystemActivityType,
      user: DemoUser,
      options?: { note?: string; occurredAt?: string },
    ) => {
      const regionId = user.regionId
      if (!regionId) return
      const titles: Record<LeadSystemActivityType, string> = {
        lead_created: "Utworzono lead",
        lead_status_changed: "Zmiana statusu",
        lead_won: "Lead wygrany",
        lead_lost: "Lead utracony",
        lead_note: "Notatka",
      }
      const now = options?.occurredAt ?? new Date().toISOString()
      setState((prev) => {
        const activity = appendLeadActivity(
          prev,
          leadId,
          user,
          type,
          titles[type],
          options?.note ?? "",
          now,
        )
        return {
          ...prev,
          leadActivities: [...prev.leadActivities, activity],
        }
      })
    },
    [appendLeadActivity],
  )

  const addLeadNote = React.useCallback(
    (leadId: string, note: string, user: DemoUser) => {
      const trimmed = note.trim()
      if (!trimmed) return
      addLeadActivity(leadId, "lead_note", user, { note: trimmed })
    },
    [addLeadActivity],
  )

  const addLead = React.useCallback(
    (lead: Lead, creator?: DemoUser) => {
      setState((prev) => {
        let leadActivities = prev.leadActivities
        if (creator?.regionId) {
          const activity = appendLeadActivity(
            prev,
            lead.id,
            creator,
            "lead_created",
            "Utworzono lead",
            lead.name,
            lead.createdAt,
          )
          leadActivities = [...leadActivities, activity]
        }
        return {
          ...prev,
          leads: [...prev.leads, lead],
          leadActivities,
        }
      })
    },
    [appendLeadActivity],
  )

  const updateLead = React.useCallback((id: string, patch: Partial<Lead>) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) => {
        if (lead.id !== id) return lead
        const next = { ...lead, ...patch }
        if (patch.phones) next.phones = trimNonEmpty(patch.phones)
        if (patch.emails) next.emails = trimNonEmpty(patch.emails)
        return next
      }),
    }))
  }, [])

  const winLead = React.useCallback(
    (
      leadId: string,
      params: {
        productId: string
        createContactFromLead?: boolean
        user: DemoUser
      },
    ) => {
      let created: Deal | null = null
      setState((prev) => {
        const lead = prev.leads.find((item) => item.id === leadId)
        if (!lead || (lead.status !== "new" && lead.status !== "in_progress")) {
          return prev
        }
        const { opportunity, leadPatch, newClient, newContact } =
          buildWinLeadResult(lead, {
            productId: params.productId,
            createContactFromLead: params.createContactFromLead,
            existingOpportunities: prev.opportunities,
            existingClients: prev.clients,
            existingContacts: prev.contacts,
            products: prev.products,
          })
        created = opportunity
        const now = new Date().toISOString()
        let clients = newClient ? [...prev.clients, newClient] : prev.clients
        if (newContact && leadPatch.clientId) {
          clients = clients.map((c) =>
            c.id === leadPatch.clientId && !c.contactIds.includes(newContact.id)
              ? { ...c, contactIds: [...c.contactIds, newContact.id] }
              : c,
          )
        }
        const contacts = newContact
          ? [...prev.contacts, newContact]
          : prev.contacts
        const wonActivity =
          params.user.regionId
            ? appendLeadActivity(
                prev,
                leadId,
                params.user,
                "lead_won",
                "Lead wygrany",
                opportunity.name,
                now,
              )
            : null
        return {
          ...prev,
          clients,
          contacts,
          opportunities: [...prev.opportunities, opportunity],
          leads: prev.leads.map((item) =>
            item.id === leadId ? { ...item, ...leadPatch } : item,
          ),
          leadActivities: wonActivity
            ? [...prev.leadActivities, wonActivity]
            : prev.leadActivities,
        }
      })
      return created
    },
    [appendLeadActivity],
  )

  const loseLead = React.useCallback(
    (leadId: string, reason: LeadLostReason, user: DemoUser) => {
      setState((prev) => {
        const lead = prev.leads.find((item) => item.id === leadId)
        if (!lead || (lead.status !== "new" && lead.status !== "in_progress")) {
          return prev
        }
        const now = new Date().toISOString()
        const lostActivity = user.regionId
          ? appendLeadActivity(
              prev,
              leadId,
              user,
              "lead_lost",
              "Lead utracony",
              LEAD_LOST_REASON_LABELS[reason],
              now,
            )
          : null
        return {
          ...prev,
          leads: prev.leads.map((item) =>
            item.id === leadId
              ? { ...item, status: "lost" as LeadStatus, lostReason: reason }
              : item,
          ),
          leadActivities: lostActivity
            ? [...prev.leadActivities, lostActivity]
            : prev.leadActivities,
        }
      })
    },
    [appendLeadActivity],
  )

  const winDeal = React.useCallback((id: string, user: DemoUser) => {
    const now = new Date().toISOString()
    setState((prev) => {
      const deal = prev.opportunities.find((item) => item.id === id)
      if (!deal || deal.status === "won" || deal.status === "lost") return prev
      const activity = appendDealActivity(
        prev,
        id,
        user,
        "deal_won",
        "Deal wygrany",
        deal.name,
        now,
      )
      return {
        ...prev,
        opportunities: prev.opportunities.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "won" as DealStatus,
                finishedByUserId: user.id,
                finishedAt: now,
                firstFinishedByUserId: item.firstFinishedByUserId ?? user.id,
              }
            : item,
        ),
        dealActivities: [...prev.dealActivities, activity],
      }
    })
  }, [appendDealActivity])

  const loseDeal = React.useCallback(
    (id: string, reason: DealLostReason, user: DemoUser) => {
      const now = new Date().toISOString()
      setState((prev) => {
        const deal = prev.opportunities.find((item) => item.id === id)
        if (!deal || deal.status === "won" || deal.status === "lost") return prev
        const activity = appendDealActivity(
          prev,
          id,
          user,
          "deal_lost",
          "Deal utracony",
          DEAL_LOST_REASON_LABELS[reason],
          now,
        )
        return {
          ...prev,
          opportunities: prev.opportunities.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "lost" as DealStatus,
                  lostReason: reason,
                  finishedByUserId: user.id,
                  finishedAt: now,
                  firstFinishedByUserId: item.firstFinishedByUserId ?? user.id,
                }
              : item,
          ),
          dealActivities: [...prev.dealActivities, activity],
        }
      })
    },
    [appendDealActivity],
  )

  const addEmployee = React.useCallback((employee: Employee) => {
    setState((prev) => ({
      ...prev,
      employees: [...prev.employees, employee],
    }))
  }, [])

  const updateEmployee = React.useCallback(
    (id: string, patch: Partial<Employee>) => {
      setState((prev) => ({
        ...prev,
        employees: prev.employees.map((emp) =>
          emp.id === id ? { ...emp, ...patch } : emp,
        ),
      }))
    },
    [],
  )

  const addDepartment = React.useCallback((department: Department) => {
    setState((prev) => ({
      ...prev,
      departments: [...prev.departments, department],
    }))
  }, [])

  const updateDepartment = React.useCallback(
    (id: string, patch: Partial<Department>) => {
      setState((prev) => ({
        ...prev,
        departments: prev.departments.map((dept) =>
          dept.id === id ? { ...dept, ...patch } : dept,
        ),
      }))
    },
    [],
  )

  const addProduct = React.useCallback((input: AddProductInput) => {
    let created: Product | null = null
    setState((prev) => {
      const now = new Date().toISOString()
      const product: Product = {
        id: createNextProductId(prev.products),
        name: input.name.trim(),
        sku: input.sku.trim(),
        goodsOrService: input.goodsOrService,
        categoryId: input.categoryId,
        price: input.price,
        currency: input.currency,
        priceKind: input.priceKind,
        availability: input.availability,
        productType: input.productType,
        condition: input.condition,
        isActive: input.isActive,
        description: input.description.trim(),
        ownerId: input.ownerId ?? "",
        regionId: input.regionId ?? "",
        createdAt: now,
      }
      created = product
      return {
        ...prev,
        products: [...prev.products, product],
      }
    })
    return created!
  }, [])

  const updateProduct = React.useCallback((id: string, patch: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id ? { ...product, ...patch } : product,
      ),
    }))
  }, [])

  const removeDepartment = React.useCallback((id: string) => {
    let result: { ok: true } | { ok: false; reason: string } = { ok: true }
    setState((prev) => {
      const inUse = prev.employees.some((e) => e.departmentId === id)
      if (inUse) {
        result = {
          ok: false,
          reason: "Nie można usunąć działu — są przypisani pracownicy.",
        }
        return prev
      }
      return {
        ...prev,
        departments: prev.departments.filter((dept) => dept.id !== id),
      }
    })
    return result
  }, [])

  const value = React.useMemo(
    () => ({
      ...state,
      deals: state.opportunities,
      addDeal,
      updateDeal,
      winDeal,
      loseDeal,
      addDealActivity,
      addDealNote,
      addDealChannelActivity,
      updateOpportunity,
      addTask,
      updateTask,
      addMeeting,
      addOpportunity,
      addClient,
      updateClient,
      addContact,
      addCompanyNote,
      addCompanyActivity,
      addLead,
      updateLead,
      addLeadActivity,
      addLeadChannelActivity,
      addLeadNote,
      winLead,
      loseLead,
      addEmployee,
      updateEmployee,
      addDepartment,
      updateDepartment,
      removeDepartment,
      addProduct,
      updateProduct,
    }),
    [
      state,
      addDeal,
      updateDeal,
      winDeal,
      loseDeal,
      addDealActivity,
      addDealNote,
      addDealChannelActivity,
      updateOpportunity,
      addTask,
      updateTask,
      addMeeting,
      addOpportunity,
      addClient,
      updateClient,
      addContact,
      addCompanyNote,
      addCompanyActivity,
      addLead,
      updateLead,
      addLeadActivity,
      addLeadChannelActivity,
      addLeadNote,
      winLead,
      loseLead,
      addEmployee,
      updateEmployee,
      addDepartment,
      updateDepartment,
      removeDepartment,
      addProduct,
      updateProduct,
    ],
  )

  return (
    <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
  )
}

export function useDemoData() {
  const context = React.useContext(DemoDataContext)
  if (!context) {
    throw new Error("useDemoData must be used within DemoDataProvider")
  }
  return context
}

