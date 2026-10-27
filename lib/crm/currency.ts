import { formatCurrency } from "@/lib/format/pl"
import type { Deal, DealCurrency } from "@/types/crm"

/** Kursy przeliczeniowe demo (PLN za 1 jednostkę) — analityka i progi liczą szanse w PLN (US-60). */
export const DEMO_FX_RATES_PLN: Record<DealCurrency, number> = {
  PLN: 1,
  EUR: 4.3,
  USD: 3.95,
  CHF: 4.55,
  GBP: 5.1,
}

export function toPln(amount: number, currency: DealCurrency): number {
  return Math.round(amount * DEMO_FX_RATES_PLN[currency])
}

/** Kwota szansy w PLN (0, gdy brak kwoty). */
export function getDealAmountPln(deal: Pick<Deal, "amount" | "currency">): number {
  return deal.amount == null ? 0 : toPln(deal.amount, deal.currency)
}

/** Kwota w walucie szansy, np. „1 250 000 €”; „—” gdy brak kwoty. */
export function formatDealAmount(deal: Pick<Deal, "amount" | "currency">): string {
  return deal.amount == null ? "—" : formatCurrency(deal.amount, deal.currency)
}
