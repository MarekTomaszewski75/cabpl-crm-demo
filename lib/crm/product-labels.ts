import type {
  Product,
  ProductAvailability,
  ProductCondition,
  ProductCurrency,
  ProductGoodsOrService,
  ProductPriceKind,
  ProductType,
} from "@/types/crm"

export const PRODUCT_GOODS_OR_SERVICE_LABELS: Record<
  ProductGoodsOrService,
  string
> = {
  goods: "Towar",
  service: "Usługa",
}

export const PRODUCT_AVAILABILITY_LABELS: Record<ProductAvailability, string> =
  {
    available: "Dostępny",
    limited: "Ograniczona",
    on_request: "Na zapytanie",
    unavailable: "Niedostępny",
  }

export const PRODUCT_PRICE_KIND_LABELS: Record<ProductPriceKind, string> = {
  fixed: "Stała",
  from: "Od",
  percent: "Procent",
  free: "Bez opłaty",
}

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  credit: "Kredyt",
  deposit: "Depozyt",
  leasing: "Leasing",
  factoring: "Faktoring",
  guarantee: "Gwarancja",
  payment: "Płatności",
  other: "Inne",
}

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  active: "Aktywny",
  draft: "Szkic",
  archived: "Zarchiwizowany",
}

export const PRODUCT_CURRENCY_LABELS: Record<ProductCurrency, string> = {
  PLN: "PLN",
  EUR: "EUR",
  USD: "USD",
}

export const PRODUCT_FILTER_DEFAULTS = {
  activeProductsTagLabel: "Aktywne produkty",
  isActive: true as const,
}

const numberFormatter = new Intl.NumberFormat("pl-PL", {
  maximumFractionDigits: 2,
})

function formatAmount(value: number, currency: ProductCurrency): string {
  if (currency === "PLN") {
    return `${numberFormatter.format(value)} PLN`
  }
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatProductPrice(
  product: Pick<Product, "price" | "currency" | "priceKind">,
): string {
  if (product.priceKind === "free") {
    return PRODUCT_PRICE_KIND_LABELS.free
  }
  if (product.priceKind === "percent") {
    if (product.price == null) return "—"
    return `${numberFormatter.format(product.price)}%`
  }
  if (product.price == null) return "—"
  const amount = formatAmount(product.price, product.currency)
  if (product.priceKind === "from") {
    return `od ${amount}`
  }
  return amount
}

export function productAvailabilityBadgeVariant(
  availability: ProductAvailability,
): "default" | "secondary" | "outline" | "destructive" {
  switch (availability) {
    case "available":
      return "default"
    case "limited":
      return "secondary"
    case "on_request":
      return "outline"
    case "unavailable":
      return "destructive"
  }
}

export function productConditionBadgeVariant(
  condition: ProductCondition,
): "default" | "secondary" | "outline" {
  switch (condition) {
    case "active":
      return "default"
    case "draft":
      return "secondary"
    case "archived":
      return "outline"
  }
}

export const PRODUCT_GOODS_OR_SERVICE_OPTIONS = (
  Object.keys(PRODUCT_GOODS_OR_SERVICE_LABELS) as ProductGoodsOrService[]
).map((value) => ({
  value,
  label: PRODUCT_GOODS_OR_SERVICE_LABELS[value],
}))

export const PRODUCT_AVAILABILITY_OPTIONS = (
  Object.keys(PRODUCT_AVAILABILITY_LABELS) as ProductAvailability[]
).map((value) => ({
  value,
  label: PRODUCT_AVAILABILITY_LABELS[value],
}))

export const PRODUCT_PRICE_KIND_OPTIONS = (
  Object.keys(PRODUCT_PRICE_KIND_LABELS) as ProductPriceKind[]
).map((value) => ({
  value,
  label: PRODUCT_PRICE_KIND_LABELS[value],
}))

export const PRODUCT_TYPE_OPTIONS = (
  Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]
).map((value) => ({
  value,
  label: PRODUCT_TYPE_LABELS[value],
}))

export const PRODUCT_CONDITION_OPTIONS = (
  Object.keys(PRODUCT_CONDITION_LABELS) as ProductCondition[]
).map((value) => ({
  value,
  label: PRODUCT_CONDITION_LABELS[value],
}))

export const PRODUCT_CURRENCY_OPTIONS = (
  Object.keys(PRODUCT_CURRENCY_LABELS) as ProductCurrency[]
).map((value) => ({
  value,
  label: PRODUCT_CURRENCY_LABELS[value],
}))
