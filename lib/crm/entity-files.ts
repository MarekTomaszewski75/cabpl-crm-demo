import { filterByScope } from "@/lib/rbac/scope"
import type {
  ClientFile,
  DealFile,
  DemoUser,
  LeadFile,
} from "@/types/crm"

export function getClientFilesForClient(
  clientId: string,
  clientFiles: readonly ClientFile[],
  user: DemoUser,
): ClientFile[] {
  return filterByScope(clientFiles, user)
    .filter((file) => file.clientId === clientId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
}

export function getLeadFilesForLead(
  leadId: string,
  leadFiles: readonly LeadFile[],
  user: DemoUser,
): LeadFile[] {
  return filterByScope(leadFiles, user)
    .filter((file) => file.leadId === leadId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
}

export function getDealFilesForDeal(
  dealId: string,
  dealFiles: readonly DealFile[],
  user: DemoUser,
): DealFile[] {
  return filterByScope(dealFiles, user)
    .filter((file) => file.dealId === dealId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
}
