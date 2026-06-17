import { formatIban } from "@/lib/format/pl"

export function normalizeDealBankAccountNumber(value: string): string | null {
  const trimmed = value.replace(/\s/g, "").trim()
  return trimmed || null
}

export function formatDealBankAccountNumber(value: string | null | undefined): string {
  if (!value?.trim()) return "—"
  return formatIban(value)
}
