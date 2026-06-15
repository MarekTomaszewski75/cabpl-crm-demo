import { filterByScope } from "@/lib/rbac/scope"
import { getMergedDocumentsForDeal } from "@/lib/crm/entity-documents"
import type { DealDocument, DealFile, DemoUser, Meeting, Task } from "@/types/crm"
import type { LeadEngagementCounts } from "@/lib/crm/lead-engagement-counts"

export type DealEngagementCounts = LeadEngagementCounts

export type DealEngagementData = {
  tasks: readonly Task[]
  meetings: readonly Meeting[]
  dealDocuments: readonly DealDocument[]
  dealFiles: readonly DealFile[]
}

export function getDealTasksForDeal(
  dealId: string,
  data: DealEngagementData,
  user: DemoUser,
): Task[] {
  return filterByScope(data.tasks, user)
    .filter((task) => task.opportunityId === dealId)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
}

export function getDealMeetingsForDeal(
  dealId: string,
  data: DealEngagementData,
  user: DemoUser,
): Meeting[] {
  return filterByScope(data.meetings, user).filter(
    (meeting) => meeting.opportunityId === dealId,
  )
}

export function getDealDocumentsForDeal(
  dealId: string,
  data: DealEngagementData,
  user: DemoUser,
): DealDocument[] {
  return filterByScope(data.dealDocuments, user)
    .filter((doc) => doc.dealId === dealId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
}

export function getDealEngagementCounts(
  dealId: string,
  data: DealEngagementData,
): DealEngagementCounts {
  return {
    tasks: data.tasks.filter((task) => task.opportunityId === dealId).length,
    meetings: data.meetings.filter(
      (meeting) => meeting.opportunityId === dealId,
    ).length,
    documents:
      data.dealDocuments.filter((doc) => doc.dealId === dealId).length +
      data.dealFiles.filter((file) => file.dealId === dealId).length,
  }
}

export function getScopedDealEngagementCounts(
  dealId: string,
  data: DealEngagementData,
  user: DemoUser,
): DealEngagementCounts {
  return {
    tasks: getDealTasksForDeal(dealId, data, user).length,
    meetings: getDealMeetingsForDeal(dealId, data, user).length,
    documents: getMergedDocumentsForDeal(
      dealId,
      data.dealFiles,
      data.dealDocuments,
      user,
    ).length,
  }
}

export function buildDealEngagementCountMap(
  dealIds: readonly string[],
  data: DealEngagementData,
): Map<string, DealEngagementCounts> {
  return new Map(
    dealIds.map((dealId) => [dealId, getDealEngagementCounts(dealId, data)]),
  )
}
