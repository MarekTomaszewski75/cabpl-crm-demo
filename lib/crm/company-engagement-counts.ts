import {
  getContactsForClient,
  type ContactBindingsData,
} from "@/lib/crm/contact-company-bindings"
import { getMergedDocumentsForClient } from "@/lib/crm/entity-documents"
import { filterByScope } from "@/lib/rbac/scope"
import type {
  Client,
  ClientDocument,
  ClientFile,
  CrmContact,
  Deal,
  DemoUser,
  Lead,
  Meeting,
  Task,
} from "@/types/crm"

export type CompanyEngagementCounts = {
  tasks: number
  meetings: number
  documents: number
  deals: number
  leads: number
  contacts: number
}

export type CompanyEngagementData = ContactBindingsData & {
  tasks: readonly Task[]
  meetings: readonly Meeting[]
  clientDocuments: readonly ClientDocument[]
  clientFiles: readonly ClientFile[]
}

export function getCompanyTasks(
  clientId: string,
  data: CompanyEngagementData,
  user: DemoUser,
): Task[] {
  return filterByScope(data.tasks, user)
    .filter((task) => task.clientId === clientId)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
}

export function getCompanyMeetings(
  clientId: string,
  data: CompanyEngagementData,
  user: DemoUser,
): Meeting[] {
  return filterByScope(data.meetings, user)
    .filter((meeting) => meeting.clientId === clientId)
    .sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )
}

export function getCompanyDocuments(
  clientId: string,
  data: CompanyEngagementData,
  user: DemoUser,
): ClientDocument[] {
  return filterByScope(data.clientDocuments, user)
    .filter((doc) => doc.clientId === clientId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
}

export function getCompanyDeals(
  clientId: string,
  data: CompanyEngagementData,
  user: DemoUser,
): Deal[] {
  return filterByScope(data.deals, user).filter(
    (deal) => deal.clientId === clientId,
  )
}

export function getCompanyLeads(
  clientId: string,
  data: CompanyEngagementData,
  user: DemoUser,
): Lead[] {
  return filterByScope(data.leads, user).filter(
    (lead) => lead.clientId === clientId,
  )
}

export function getCompanyContacts(
  client: Client,
  data: CompanyEngagementData,
  user: DemoUser,
): CrmContact[] {
  return getContactsForClient(client.id, data, user).map((row) => row.contact)
}

export function getScopedCompanyEngagementCounts(
  client: Client,
  data: CompanyEngagementData,
  user: DemoUser,
): CompanyEngagementCounts {
  return {
    tasks: getCompanyTasks(client.id, data, user).length,
    meetings: getCompanyMeetings(client.id, data, user).length,
    documents: getMergedDocumentsForClient(
      client.id,
      data.clientFiles,
      data.clientDocuments,
      user,
    ).length,
    deals: getCompanyDeals(client.id, data, user).length,
    leads: getCompanyLeads(client.id, data, user).length,
    contacts: getCompanyContacts(client, data, user).length,
  }
}
