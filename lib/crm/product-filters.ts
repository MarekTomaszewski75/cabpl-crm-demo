import type {
  Product,
  ProductAvailability,
  ProductCondition,
  ProductPriceKind,
  ProductType,
} from "@/types/crm"

export const PRODUCT_ACTIVITY_ACTIVE = "active"
export const PRODUCT_ACTIVITY_INACTIVE = "inactive"

export type ProductListFilters = {
  categoryFilters: string[]
  searchQuery: string
  activityFilters: string[]
  availabilityFilters: ProductAvailability[]
  priceKindFilters: ProductPriceKind[]
  productTypeFilters: ProductType[]
  conditionFilters: ProductCondition[]
}

function matchesActivity(product: Product, filters: string[]): boolean {
  if (filters.length === 0) return true
  return filters.some((filter) => {
    if (filter === PRODUCT_ACTIVITY_ACTIVE) return product.isActive
    if (filter === PRODUCT_ACTIVITY_INACTIVE) return !product.isActive
    return false
  })
}

export function filterProducts(
  products: readonly Product[],
  filters: ProductListFilters,
): Product[] {
  const searchNormalized = filters.searchQuery.trim().toLowerCase()

  return products.filter((product) => {
    if (
      filters.categoryFilters.length > 0 &&
      !filters.categoryFilters.includes(product.categoryId)
    ) {
      return false
    }
    if (!matchesActivity(product, filters.activityFilters)) {
      return false
    }
    if (
      filters.availabilityFilters.length > 0 &&
      !filters.availabilityFilters.includes(product.availability)
    ) {
      return false
    }
    if (
      filters.priceKindFilters.length > 0 &&
      !filters.priceKindFilters.includes(product.priceKind)
    ) {
      return false
    }
    if (
      filters.productTypeFilters.length > 0 &&
      !filters.productTypeFilters.includes(product.productType)
    ) {
      return false
    }
    if (
      filters.conditionFilters.length > 0 &&
      !filters.conditionFilters.includes(product.condition)
    ) {
      return false
    }
    if (!searchNormalized) return true
    const haystack =
      `${product.name} ${product.sku} ${product.description}`.toLowerCase()
    return haystack.includes(searchNormalized)
  })
}
