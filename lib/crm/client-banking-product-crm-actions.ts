import type { EnrichedClientBankingProduct } from "@/lib/crm/client-banking-products"
import { formatDatePl } from "@/lib/format/pl"

export function getClientBankingProductDefaultTaskTitle(
  item: EnrichedClientBankingProduct,
): string {
  if (item.status === "expiring") {
    return `Odnowienie — ${item.product.name}`
  }
  if (item.status === "blocked") {
    return `Kontakt ws. blokady — ${item.product.name}`
  }
  return `Kontakt ws. ${item.product.name}`
}

export function getClientBankingProductDefaultMeetingTitle(
  item: EnrichedClientBankingProduct,
  clientName: string,
): string {
  return `Spotkanie — ${clientName} (${item.product.name})`
}

export function getClientBankingProductDefaultMeetingNote(
  item: EnrichedClientBankingProduct,
): string {
  return `Omówienie produktu: ${item.product.name} · ${item.contractNumber}`
}

export function getClientBankingProductDefaultNoteDraft(
  item: EnrichedClientBankingProduct,
): string {
  const expiry = item.expiresAt
    ? `, ważny do ${formatDatePl(item.expiresAt)}`
    : ""
  return `Produkt bankowy: ${item.product.name} (${item.contractNumber}${expiry}) — `
}
