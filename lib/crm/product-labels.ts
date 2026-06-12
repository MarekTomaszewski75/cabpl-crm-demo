import type {
  ProductAvailability,
  ProductCondition,
  ProductGoodsOrService,
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

export const PRODUCT_FILTER_DEFAULTS = {
  activeProductsTagLabel: "Aktywne produkty",
  isActive: true as const,
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
