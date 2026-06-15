import { filterByScope } from "@/lib/rbac/scope"
import type {
  ClientDocument,
  ClientFile,
  DealDocument,
  DealFile,
  DemoUser,
  LeadDocument,
  LeadFile,
} from "@/types/crm"

export type CrmDocumentListItemSource = "file" | "legacy-document"

export type CrmDocumentListItem = {
  id: string
  source: CrmDocumentListItemSource
  displayName: string
  description?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  uploadedAt: string
  ownerId: string
}

export const LEGACY_DOCUMENT_MIME = "application/x-demo-document"

function sortByUploadedAtDesc(
  items: CrmDocumentListItem[],
): CrmDocumentListItem[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )
}

function fileToListItem(
  file: ClientFile | LeadFile | DealFile,
): CrmDocumentListItem {
  return {
    id: file.id,
    source: "file",
    displayName: file.displayName,
    description: file.description,
    fileName: file.fileName,
    fileSize: file.fileSize,
    mimeType: file.mimeType,
    uploadedAt: file.uploadedAt,
    ownerId: file.ownerId,
  }
}

function legacyDocumentToListItem(
  doc: ClientDocument | LeadDocument | DealDocument,
): CrmDocumentListItem {
  return {
    id: doc.id,
    source: "legacy-document",
    displayName: doc.name,
    fileName: doc.name,
    mimeType: LEGACY_DOCUMENT_MIME,
    uploadedAt: doc.uploadedAt,
    ownerId: doc.ownerId,
  }
}

export function getMergedDocumentsForClient(
  clientId: string,
  clientFiles: readonly ClientFile[],
  clientDocuments: readonly ClientDocument[],
  user: DemoUser,
): CrmDocumentListItem[] {
  const files = filterByScope(clientFiles, user)
    .filter((file) => file.clientId === clientId)
    .map(fileToListItem)
  const documents = filterByScope(clientDocuments, user)
    .filter((doc) => doc.clientId === clientId)
    .map(legacyDocumentToListItem)

  return sortByUploadedAtDesc([...files, ...documents])
}

export function getMergedDocumentsForLead(
  leadId: string,
  leadFiles: readonly LeadFile[],
  leadDocuments: readonly LeadDocument[],
  user: DemoUser,
): CrmDocumentListItem[] {
  const files = filterByScope(leadFiles, user)
    .filter((file) => file.leadId === leadId)
    .map(fileToListItem)
  const documents = filterByScope(leadDocuments, user)
    .filter((doc) => doc.leadId === leadId)
    .map(legacyDocumentToListItem)

  return sortByUploadedAtDesc([...files, ...documents])
}

export function getMergedDocumentsForDeal(
  dealId: string,
  dealFiles: readonly DealFile[],
  dealDocuments: readonly DealDocument[],
  user: DemoUser,
): CrmDocumentListItem[] {
  const files = filterByScope(dealFiles, user)
    .filter((file) => file.dealId === dealId)
    .map(fileToListItem)
  const documents = filterByScope(dealDocuments, user)
    .filter((doc) => doc.dealId === dealId)
    .map(legacyDocumentToListItem)

  return sortByUploadedAtDesc([...files, ...documents])
}
