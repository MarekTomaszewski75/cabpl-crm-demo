import type { LeadSource } from "@/types/crm"

export type ProspectImportRow = {
  id: string
  companyName: string
  nip: string
  leadName: string
  source: LeadSource
}

/** Podgląd importu na demo — jeden wiersz trafia w NIP Polska Logistyka S.A. */
export const PROSPECT_IMPORT_ROWS: readonly ProspectImportRow[] = [
  {
    id: "imp-nordic",
    companyName: "Nordic Components Sp. z o.o.",
    nip: "7770001101",
    leadName: "Kredyt obrotowy — Nordic Components",
    source: "partner",
  },
  {
    id: "imp-logistyka",
    companyName: "Polska Logistyka S.A.",
    nip: "5210001001",
    leadName: "Limit gwarancji — Polska Logistyka",
    source: "recommendation",
  },
  {
    id: "imp-huta",
    companyName: "Huta Północ Sp. z o.o.",
    nip: "7770001103",
    leadName: "Leasing linii — Huta Północ",
    source: "phone_call",
  },
]
