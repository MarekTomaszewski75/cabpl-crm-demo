"use client"

import * as React from "react"
import { loadSeedData, type DemoDataState } from "@/lib/data/seed"
import { createNextLeadActivityId } from "@/lib/crm/lead-activity-id"
import { createNextLeadDocumentId } from "@/lib/crm/lead-document-id"
import { createNextDealDocumentId } from "@/lib/crm/deal-document-id"
import { createNextClientDocumentId } from "@/lib/crm/client-document-id"
import { createNextClientFileId } from "@/lib/crm/client-file-id"
import { createNextLeadFileId } from "@/lib/crm/lead-file-id"
import { createNextDealFileId } from "@/lib/crm/deal-file-id"
import { toast } from "sonner"
import { resolveLeadActivityKind } from "@/lib/crm/lead-activity"
import { createNextDealActivityId } from "@/lib/crm/deal-activity-id"
import { resolveDealActivityKind } from "@/lib/crm/deal-activity"
import { formatDealExpectedCloseDateChangeNote } from "@/lib/crm/deal-close-date-urgency"
import { LEAD_LOST_REASON_LABELS } from "@/lib/crm/lead-labels"
import { DEAL_LOST_REASON_LABELS } from "@/lib/crm/deal-labels"
import {
  buildWinLeadResult,
} from "@/lib/crm/win-lead"
import { createNextClientId } from "@/lib/crm/client-id"
import { createNextContactId } from "@/lib/crm/contact-id"
import { createNextContactEventId } from "@/lib/crm/contact-event-id"
import { createNextOpportunityId } from "@/lib/crm/opportunity-id"
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
  AddCompanyActivityInput,
  AddCrmContactInput,
  UpdateCrmContactInput,
  Client,
  ContactClientLink,
  ContactEvent,
  CrmContact,
  DemoUser,
  Department,
  Employee,
  AddDealActivityInput,
  AddLeadActivityInput,
  AddLeadDocumentInput,
  AddDealDocumentInput,
  AddClientDocumentInput,
  AddClientFileInput,
  AddLeadFileInput,
  AddDealFileInput,
  Lead,
  LeadDocument,
  DealDocument,
  ClientDocument,
  ClientFile,
  LeadFile,
  DealFile,
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

function syncContactClientLinks(
  links: readonly ContactClientLink[],
  clientId: string,
  prevContactIds: readonly string[],
  nextContactIds: readonly string[],
): ContactClientLink[] {
  const removed = new Set(
    prevContactIds.filter((id) => !nextContactIds.includes(id)),
  )
  const added = nextContactIds.filter((id) => !prevContactIds.includes(id))

  let nextLinks = links.filter(
    (link) => !(link.clientId === clientId && removed.has(link.contactId)),
  )

  for (const contactId of added) {
    const exists = nextLinks.some(
      (link) => link.clientId === clientId && link.contactId === contactId,
    )
    if (!exists) {
      nextLinks = [
        ...nextLinks,
        { contactId, clientId, roleAtCompany: "" },
      ]
    }
  }

  return nextLinks
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
  updateDeal: (
    id: string,
    patch: Partial<Deal>,
    actingUser?: DemoUser,
  ) => void
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
  updateTask: (
    id: string,
    patch: Partial<Task>,
    actingUser?: DemoUser,
  ) => void
  addMeeting: (meeting: Meeting) => void
  addOpportunity: (opportunity: Deal) => void
  addClient: (input: AddClientInput, user: DemoUser) => Client
  updateClient: (id: string, patch: Partial<Client>) => void
  deleteClient: (id: string) => void
  addContact: (input: AddCrmContactInput) => CrmContact
  updateContact: (id: string, patch: UpdateCrmContactInput) => void
  upsertContactClientLink: (
    contactId: string,
    clientId: string,
    roleAtCompany: string,
  ) => void
  addCompanyNote: (clientId: string, note: string, user: DemoUser) => void
  addCompanyActivity: (
    clientId: string,
    input: AddCompanyActivityInput,
    user: DemoUser,
  ) => void
  addLead: (lead: Lead, creator?: DemoUser) => void
  updateLead: (id: string, patch: Partial<Lead>) => void
  deleteLead: (id: string) => void
  deleteDeal: (id: string) => void
  addLeadDocument: (
    leadId: string,
    input: AddLeadDocumentInput,
    user: DemoUser,
  ) => LeadDocument | null
  addDealDocument: (
    dealId: string,
    input: AddDealDocumentInput,
    user: DemoUser,
  ) => DealDocument | null
  addClientDocument: (
    clientId: string,
    input: AddClientDocumentInput,
    user: DemoUser,
  ) => ClientDocument | null
  addClientFile: (
    clientId: string,
    input: AddClientFileInput,
    user: DemoUser,
  ) => ClientFile | null
  removeClientFile: (id: string) => void
  addLeadFile: (
    leadId: string,
    input: AddLeadFileInput,
    user: DemoUser,
  ) => LeadFile | null
  removeLeadFile: (id: string) => void
  addDealFile: (
    dealId: string,
    input: AddDealFileInput,
    user: DemoUser,
  ) => DealFile | null
  removeDealFile: (id: string) => void
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
          clientId: input.clientId ?? null,
          lostReason: null,
          finishedByUserId: null,
          finishedAt: null,
          firstFinishedByUserId: null,
          createdAt: now,
          ownerId: input.ownerId,
          regionId: input.regionId,
          ...(input.expectedCloseDate?.trim()
            ? { expectedCloseDate: input.expectedCloseDate.trim() }
            : {}),
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

  const addTask = React.useCallback((task: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
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
    setState((prev) => {
      const clients = prev.clients.map((client) => {
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
      })

      const updatedClient = clients.find((client) => client.id === id)
      const previousClient = prev.clients.find((client) => client.id === id)
      const contactClientLinks =
        patch.contactIds && updatedClient && previousClient
          ? syncContactClientLinks(
              prev.contactClientLinks,
              id,
              previousClient.contactIds,
              updatedClient.contactIds,
            )
          : prev.contactClientLinks

      return { ...prev, clients, contactClientLinks }
    })
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

  const updateContact = React.useCallback(
    (id: string, patch: UpdateCrmContactInput) => {
      setState((prev) => ({
        ...prev,
        contacts: prev.contacts.map((contact) => {
          if (contact.id !== id) return contact
          const next = { ...contact, ...patch }
          if (patch.emails !== undefined) next.emails = trimNonEmpty(patch.emails)
          if (patch.phones !== undefined) next.phones = trimNonEmpty(patch.phones)
          if (patch.firstName !== undefined) {
            next.firstName = patch.firstName.trim()
          }
          if (patch.lastName !== undefined) {
            next.lastName = patch.lastName.trim()
          }
          return next
        }),
      }))
    },
    [],
  )

  const upsertContactClientLink = React.useCallback(
    (contactId: string, clientId: string, roleAtCompany: string) => {
      const trimmedRole = roleAtCompany.trim()
      setState((prev) => {
        const existingIndex = prev.contactClientLinks.findIndex(
          (link) =>
            link.contactId === contactId && link.clientId === clientId,
        )
        if (existingIndex >= 0) {
          return {
            ...prev,
            contactClientLinks: prev.contactClientLinks.map((link, index) =>
              index === existingIndex
                ? { ...link, roleAtCompany: trimmedRole }
                : link,
            ),
          }
        }
        return {
          ...prev,
          contactClientLinks: [
            ...prev.contactClientLinks,
            { contactId, clientId, roleAtCompany: trimmedRole },
          ],
        }
      })
    },
    [],
  )

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
      const lead = prev.leads.find((item) => item.id === leadId)
      const regionId = user.regionId ?? lead?.regionId
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
      const deal = prev.opportunities.find((item) => item.id === dealId)
      const regionId = user.regionId ?? deal?.regionId
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

  const updateDeal = React.useCallback(
    (id: string, patch: Partial<Deal>, actingUser?: DemoUser) => {
      setState((prev) => {
        const deal = prev.opportunities.find((item) => item.id === id)
        if (!deal) return prev

        const safePatch = applyDealPatch(deal, patch, prev.products)
        const nextPatch: Partial<Deal> = { ...safePatch }

        if ("expectedCloseDate" in nextPatch) {
          const value = nextPatch.expectedCloseDate
          nextPatch.expectedCloseDate =
            value && value.trim() ? value.trim() : undefined
        }

        let dealActivities = prev.dealActivities
        if (actingUser && "expectedCloseDate" in patch) {
          const previous = deal.expectedCloseDate
          const next = nextPatch.expectedCloseDate
          if (previous !== next) {
            const activity = appendDealActivity(
              prev,
              id,
              actingUser,
              "deal_expected_close_changed",
              "Zmieniono planowaną datę zamknięcia",
              formatDealExpectedCloseDateChangeNote(previous, next),
              new Date().toISOString(),
            )
            dealActivities = [...dealActivities, activity]
          }
        }

        return {
          ...prev,
          opportunities: prev.opportunities.map((item) =>
            item.id === id ? { ...item, ...nextPatch } : item,
          ),
          dealActivities,
        }
      })
    },
    [applyDealPatch, appendDealActivity],
  )

  const updateTask = React.useCallback(
    (id: string, patch: Partial<Task>, actingUser?: DemoUser) => {
      setState((prev) => {
        const task = prev.tasks.find((item) => item.id === id)
        if (!task) return prev

        const nextTask = { ...task, ...patch }
        let leadActivities = prev.leadActivities
        let dealActivities = prev.dealActivities

        if (patch.completed === true && !task.completed && actingUser) {
          if (nextTask.leadId) {
            const activity = appendLeadActivity(
              prev,
              nextTask.leadId,
              actingUser,
              "lead_task_completed",
              "Zadanie wykonane",
              nextTask.title,
              new Date().toISOString(),
            )
            leadActivities = [...leadActivities, activity]
          }
          if (nextTask.opportunityId) {
            const activity = appendDealActivity(
              prev,
              nextTask.opportunityId,
              actingUser,
              "deal_task_completed",
              "Zadanie wykonane",
              nextTask.title,
              new Date().toISOString(),
            )
            dealActivities = [...dealActivities, activity]
          }
        }

        return {
          ...prev,
          tasks: prev.tasks.map((item) =>
            item.id === id ? nextTask : item,
          ),
          leadActivities,
          dealActivities,
        }
      })
    },
    [appendLeadActivity, appendDealActivity],
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
        deal_expected_close_changed: "Zmieniono planowaną datę zamknięcia",
        deal_won: "Deal wygrany",
        deal_lost: "Deal utracony",
        deal_note: "Notatka",
        deal_document_added: "Dodano dokument",
        deal_task_created: "Utworzono zadanie",
        deal_task_completed: "Zadanie wykonane",
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
      setState((prev) => {
        const deal = prev.opportunities.find((item) => item.id === dealId)
        const regionId = user.regionId ?? deal?.regionId
        if (!regionId) return prev

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
      setState((prev) => {
        const lead = prev.leads.find((item) => item.id === leadId)
        const regionId = user.regionId ?? lead?.regionId
        if (!regionId) return prev

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
      const titles: Record<LeadSystemActivityType, string> = {
        lead_created: "Utworzono lead",
        lead_status_changed: "Zmiana statusu",
        lead_won: "Lead wygrany",
        lead_lost: "Lead utracony",
        lead_note: "Notatka",
        lead_document_added: "Dodano dokument",
        lead_task_created: "Utworzono zadanie",
        lead_task_completed: "Zadanie wykonane",
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

  const deleteLead = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.filter((lead) => lead.id !== id),
      leadActivities: prev.leadActivities.filter(
        (activity) => activity.leadId !== id,
      ),
      leadDocuments: prev.leadDocuments.filter((doc) => doc.leadId !== id),
      leadFiles: prev.leadFiles.filter((file) => file.leadId !== id),
      tasks: prev.tasks.map((task) =>
        task.leadId === id ? { ...task, leadId: null } : task,
      ),
      meetings: prev.meetings.map((meeting) =>
        meeting.leadId === id ? { ...meeting, leadId: null } : meeting,
      ),
    }))
  }, [])

  const deleteDeal = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      opportunities: prev.opportunities.filter((deal) => deal.id !== id),
      dealActivities: prev.dealActivities.filter(
        (activity) => activity.dealId !== id,
      ),
      dealDocuments: prev.dealDocuments.filter((doc) => doc.dealId !== id),
      dealFiles: prev.dealFiles.filter((file) => file.dealId !== id),
      tasks: prev.tasks.map((task) =>
        task.opportunityId === id ? { ...task, opportunityId: null } : task,
      ),
      meetings: prev.meetings.map((meeting) =>
        meeting.opportunityId === id
          ? { ...meeting, opportunityId: null }
          : meeting,
      ),
    }))
  }, [])

  const deleteClient = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((client) => client.id !== id),
      contactEvents: prev.contactEvents.filter(
        (event) => event.clientId !== id,
      ),
      clientDocuments: prev.clientDocuments.filter(
        (doc) => doc.clientId !== id,
      ),
      clientFiles: prev.clientFiles.filter((file) => file.clientId !== id),
      opportunities: prev.opportunities.map((deal) =>
        deal.clientId === id ? { ...deal, clientId: null } : deal,
      ),
      leads: prev.leads.map((lead) =>
        lead.clientId === id ? { ...lead, clientId: null } : lead,
      ),
      tasks: prev.tasks.map((task) =>
        task.clientId === id ? { ...task, clientId: null } : task,
      ),
      meetings: prev.meetings.filter((meeting) => meeting.clientId !== id),
    }))
  }, [])

  const addLeadDocument = React.useCallback(
    (
      leadId: string,
      input: AddLeadDocumentInput,
      user: DemoUser,
    ): LeadDocument | null => {
      const name = input.name.trim()
      if (!name) return null

      let created: LeadDocument | null = null
      setState((prev) => {
        const lead = prev.leads.find((item) => item.id === leadId)
        const regionId = user.regionId ?? lead?.regionId
        if (!regionId) return prev

        const doc: LeadDocument = {
          id: createNextLeadDocumentId(prev.leadDocuments),
          leadId,
          name,
          uploadedAt: new Date().toISOString(),
          ownerId: user.id,
          regionId,
        }
        created = doc
        return {
          ...prev,
          leadDocuments: [...prev.leadDocuments, doc],
        }
      })
      if (!created) {
        toast.error("Nie udało się dodać dokumentu.")
      }
      return created
    },
    [],
  )

  const addDealDocument = React.useCallback(
    (
      dealId: string,
      input: AddDealDocumentInput,
      user: DemoUser,
    ): DealDocument | null => {
      const name = input.name.trim()
      if (!name) return null

      let created: DealDocument | null = null
      setState((prev) => {
        const deal = prev.opportunities.find((item) => item.id === dealId)
        const regionId = user.regionId ?? deal?.regionId
        if (!regionId) return prev

        const doc: DealDocument = {
          id: createNextDealDocumentId(prev.dealDocuments),
          dealId,
          name,
          uploadedAt: new Date().toISOString(),
          ownerId: user.id,
          regionId,
        }
        created = doc
        return {
          ...prev,
          dealDocuments: [...prev.dealDocuments, doc],
        }
      })
      if (!created) {
        toast.error("Nie udało się dodać dokumentu.")
      }
      return created
    },
    [],
  )

  const addClientDocument = React.useCallback(
    (
      clientId: string,
      input: AddClientDocumentInput,
      user: DemoUser,
    ): ClientDocument | null => {
      const name = input.name.trim()
      if (!name) return null

      let created: ClientDocument | null = null
      setState((prev) => {
        const client = prev.clients.find((item) => item.id === clientId)
        const regionId = user.regionId ?? client?.regionId
        if (!regionId) return prev

        const doc: ClientDocument = {
          id: createNextClientDocumentId(prev.clientDocuments),
          clientId,
          name,
          uploadedAt: new Date().toISOString(),
          ownerId: user.id,
          regionId,
        }
        created = doc
        return {
          ...prev,
          clientDocuments: [...prev.clientDocuments, doc],
        }
      })
      if (!created) {
        toast.error("Nie udało się dodać dokumentu.")
      }
      return created
    },
    [],
  )

  const addClientFile = React.useCallback(
    (
      clientId: string,
      input: AddClientFileInput,
      user: DemoUser,
    ): ClientFile | null => {
      const fileName = input.fileName.trim()
      if (!fileName) return null
      const displayName = input.displayName.trim() || fileName
      const description = input.description?.trim()

      let created: ClientFile | null = null
      setState((prev) => {
        const client = prev.clients.find((item) => item.id === clientId)
        const regionId = user.regionId ?? client?.regionId
        if (!regionId) return prev

        const file: ClientFile = {
          id: createNextClientFileId(prev.clientFiles),
          clientId,
          fileName,
          displayName,
          ...(description ? { description } : {}),
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          uploadedAt: new Date().toISOString(),
          ownerId: user.id,
          regionId,
        }
        created = file
        return {
          ...prev,
          clientFiles: [...prev.clientFiles, file],
        }
      })
      if (!created) {
        toast.error("Nie udało się dodać pliku.")
      }
      return created
    },
    [],
  )

  const removeClientFile = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      clientFiles: prev.clientFiles.filter((file) => file.id !== id),
    }))
  }, [])

  const addLeadFile = React.useCallback(
    (
      leadId: string,
      input: AddLeadFileInput,
      user: DemoUser,
    ): LeadFile | null => {
      const fileName = input.fileName.trim()
      if (!fileName) return null
      const displayName = input.displayName.trim() || fileName
      const description = input.description?.trim()

      let created: LeadFile | null = null
      setState((prev) => {
        const lead = prev.leads.find((item) => item.id === leadId)
        const regionId = user.regionId ?? lead?.regionId
        if (!regionId) return prev

        const file: LeadFile = {
          id: createNextLeadFileId(prev.leadFiles),
          leadId,
          fileName,
          displayName,
          ...(description ? { description } : {}),
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          uploadedAt: new Date().toISOString(),
          ownerId: user.id,
          regionId,
        }
        created = file
        return {
          ...prev,
          leadFiles: [...prev.leadFiles, file],
        }
      })
      if (!created) {
        toast.error("Nie udało się dodać pliku.")
      }
      return created
    },
    [],
  )

  const removeLeadFile = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      leadFiles: prev.leadFiles.filter((file) => file.id !== id),
    }))
  }, [])

  const addDealFile = React.useCallback(
    (
      dealId: string,
      input: AddDealFileInput,
      user: DemoUser,
    ): DealFile | null => {
      const fileName = input.fileName.trim()
      if (!fileName) return null
      const displayName = input.displayName.trim() || fileName
      const description = input.description?.trim()

      let created: DealFile | null = null
      setState((prev) => {
        const deal = prev.opportunities.find((item) => item.id === dealId)
        const regionId = user.regionId ?? deal?.regionId
        if (!regionId) return prev

        const file: DealFile = {
          id: createNextDealFileId(prev.dealFiles),
          dealId,
          fileName,
          displayName,
          ...(description ? { description } : {}),
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          uploadedAt: new Date().toISOString(),
          ownerId: user.id,
          regionId,
        }
        created = file
        return {
          ...prev,
          dealFiles: [...prev.dealFiles, file],
        }
      })
      if (!created) {
        toast.error("Nie udało się dodać pliku.")
      }
      return created
    },
    [],
  )

  const removeDealFile = React.useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dealFiles: prev.dealFiles.filter((file) => file.id !== id),
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
        const wonActivity = appendLeadActivity(
          prev,
          leadId,
          params.user,
          "lead_won",
          "Lead wygrany",
          opportunity.name,
          now,
        )
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
        const lostActivity = appendLeadActivity(
          prev,
          leadId,
          user,
          "lead_lost",
          "Lead utracony",
          LEAD_LOST_REASON_LABELS[reason],
          now,
        )
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
      deleteClient,
      addContact,
      updateContact,
      upsertContactClientLink,
      addCompanyNote,
      addCompanyActivity,
      addLead,
      updateLead,
      deleteLead,
      deleteDeal,
      addLeadDocument,
      addDealDocument,
      addClientDocument,
      addClientFile,
      removeClientFile,
      addLeadFile,
      removeLeadFile,
      addDealFile,
      removeDealFile,
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
      deleteClient,
      addContact,
      updateContact,
      upsertContactClientLink,
      addCompanyNote,
      addCompanyActivity,
      addLead,
      updateLead,
      deleteLead,
      deleteDeal,
      addLeadDocument,
      addDealDocument,
      addClientDocument,
      addClientFile,
      removeClientFile,
      addLeadFile,
      removeLeadFile,
      addDealFile,
      removeDealFile,
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

