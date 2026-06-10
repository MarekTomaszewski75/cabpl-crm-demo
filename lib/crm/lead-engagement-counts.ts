import { filterByScope } from "@/lib/rbac/scope"
import type { DemoUser, LeadDocument, Meeting, Task } from "@/types/crm"

export type LeadEngagementCounts = {
  tasks: number
  meetings: number
  documents: number
}

export type LeadEngagementData = {
  tasks: readonly Task[]
  meetings: readonly Meeting[]
  leadDocuments: readonly LeadDocument[]
}

export function getLeadTasksForLead(
  leadId: string,
  data: LeadEngagementData,
  user: DemoUser,
): Task[] {
  return filterByScope(data.tasks, user)
    .filter((task) => task.leadId === leadId)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
}

export function getLeadMeetingsForLead(
  leadId: string,
  data: LeadEngagementData,
  user: DemoUser,
): Meeting[] {
  return filterByScope(data.meetings, user).filter(
    (meeting) => meeting.leadId === leadId,
  )
}

export function getLeadDocumentsForLead(
  leadId: string,
  data: LeadEngagementData,
  user: DemoUser,
): LeadDocument[] {
  return filterByScope(data.leadDocuments, user)
    .filter((doc) => doc.leadId === leadId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
}

export function getLeadEngagementCounts(
  leadId: string,
  data: LeadEngagementData,
): LeadEngagementCounts {
  return {
    tasks: data.tasks.filter((task) => task.leadId === leadId).length,
    meetings: data.meetings.filter((meeting) => meeting.leadId === leadId).length,
    documents: data.leadDocuments.filter((doc) => doc.leadId === leadId).length,
  }
}

export function getScopedLeadEngagementCounts(
  leadId: string,
  data: LeadEngagementData,
  user: DemoUser,
): LeadEngagementCounts {
  return {
    tasks: getLeadTasksForLead(leadId, data, user).length,
    meetings: getLeadMeetingsForLead(leadId, data, user).length,
    documents: getLeadDocumentsForLead(leadId, data, user).length,
  }
}

export function buildLeadEngagementCountMap(
  leadIds: readonly string[],
  data: LeadEngagementData,
): Map<string, LeadEngagementCounts> {
  return new Map(
    leadIds.map((leadId) => [leadId, getLeadEngagementCounts(leadId, data)]),
  )
}
