import type { DealDocument, Meeting, Task } from "@/types/crm"
import type { LeadEngagementCounts } from "@/lib/crm/lead-engagement-counts"

export type DealEngagementCounts = LeadEngagementCounts

export type DealEngagementData = {
  tasks: readonly Task[]
  meetings: readonly Meeting[]
  dealDocuments: readonly DealDocument[]
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
    documents: data.dealDocuments.filter((doc) => doc.dealId === dealId).length,
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
