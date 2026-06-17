import type { BankAccountType } from "@/types/crm"

export const BANK_ACCOUNT_TYPE_LABELS: Record<BankAccountType, string> = {
  current: "Bieżący",
  auxiliary: "Pomocniczy",
  foreign: "Walutowy",
  deposit: "Lokaty / depozytowy",
  escrow: "Powierniczy (escrow)",
  vat: "VAT",
}

export const BANK_ACCOUNT_TYPE_OPTIONS = (
  Object.keys(BANK_ACCOUNT_TYPE_LABELS) as BankAccountType[]
).map((value) => ({
  value,
  label: BANK_ACCOUNT_TYPE_LABELS[value],
}))
