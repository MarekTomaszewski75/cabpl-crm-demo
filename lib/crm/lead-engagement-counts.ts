import type { LeadDocument, Meeting, Task } from "@/types/crm"

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

export function buildLeadEngagementCountMap(
  leadIds: readonly string[],
  data: LeadEngagementData,
): Map<string, LeadEngagementCounts> {
  return new Map(
    leadIds.map((leadId) => [leadId, getLeadEngagementCounts(leadId, data)]),
  )
}
