import type { DocumentRepositoryId } from "@/types/crm"

/** Systemy dokumentów Banku (QW-16, QW-17) — w QW CRM przechowuje odnośnik, nie plik. */
export const DOCUMENT_REPOSITORY_LABELS: Record<DocumentRepositoryId, string> = {
  aida: "AIDA",
  sharepoint: "SharePoint",
  drive_s: "Dysk S",
  case_pro: "CASE PRO",
}

export const DOCUMENT_REPOSITORY_OPTIONS = (
  Object.entries(DOCUMENT_REPOSITORY_LABELS) as [DocumentRepositoryId, string][]
).map(([value, label]) => ({ value, label }))

/** Typ MIME rekordu-odnośnika (bez pliku w CRM). */
export const REPOSITORY_LINK_MIME = "application/x-repository-link"

export type CrmDocumentLinkInput = {
  repositoryId: DocumentRepositoryId
  externalRef: string
  displayName: string
  description?: string
}

/** Odnośnik jako rekord `*File` bez pliku — te same akcje i lista co upload (US-60). */
export function toRepositoryFileInput(input: CrmDocumentLinkInput) {
  return {
    fileName: input.externalRef,
    displayName: input.displayName,
    description: input.description,
    fileSize: 0,
    mimeType: REPOSITORY_LINK_MIME,
    repository: {
      repositoryId: input.repositoryId,
      externalRef: input.externalRef,
    },
  }
}
