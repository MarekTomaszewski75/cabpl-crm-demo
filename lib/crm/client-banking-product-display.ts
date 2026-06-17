import { formatCurrency } from "@/lib/format/pl"
import type { EnrichedClientBankingProduct } from "@/lib/crm/client-banking-products"
import type { ProductType } from "@/types/crm"

const LIMIT_PRODUCT_TYPES: ProductType[] = [
  "credit",
  "leasing",
  "factoring",
  "guarantee",
]

export function isLimitBasedClientBankingProduct(
  item: EnrichedClientBankingProduct,
): boolean {
  return (
    LIMIT_PRODUCT_TYPES.includes(item.product.productType) &&
    item.limitAmount != null
  )
}

export function getClientBankingProductUtilizationPercent(
  item: EnrichedClientBankingProduct,
): number | null {
  if (!isLimitBasedClientBankingProduct(item)) return null
  if (item.limitAmount == null || item.limitAmount <= 0) return null
  if (item.utilizedAmount == null) return 0
  return Math.min(
    100,
    Math.round((item.utilizedAmount / item.limitAmount) * 100),
  )
}

export function formatClientBankingProductAmountSummary(
  item: EnrichedClientBankingProduct,
): string {
  const { product, currency } = item

  if (
    LIMIT_PRODUCT_TYPES.includes(product.productType) &&
    item.limitAmount != null
  ) {
    const limit = formatCurrency(item.limitAmount, currency)
    if (item.utilizedAmount != null) {
      const utilized = formatCurrency(item.utilizedAmount, currency)
      return `Limit ${limit} · Wyk. ${utilized}`
    }
    return `Limit ${limit}`
  }

  if (item.balanceAmount != null) {
    return `Saldo ${formatCurrency(item.balanceAmount, currency)}`
  }

  return "—"
}
