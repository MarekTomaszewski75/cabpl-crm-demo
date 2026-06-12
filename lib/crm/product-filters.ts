import type {
  Product,
  ProductAvailability,
  ProductCategory,
  ProductCondition,
  ProductType,
} from "@/types/crm"

export const PRODUCT_ACTIVITY_ACTIVE = "active"
export const PRODUCT_ACTIVITY_INACTIVE = "inactive"

export type ProductListFilters = {
  categoryFilters: string[]
  searchQuery: string
  activityFilters: string[]
  availabilityFilters: ProductAvailability[]
  productTypeFilters: ProductType[]
  conditionFilters: ProductCondition[]
}

/** Liść → `[id]`; korzeń z dziećmi → ID podkategorii (np. `pcat-leasing` → op + faktoring). */
export function getCategoryIdsForSelection(
  categoryId: string,
  categories: readonly ProductCategory[],
): string[] {
  const children = categories.filter(
    (category) => category.parentId === categoryId,
  )
  if (children.length > 0) {
    return children.map((category) => category.id)
  }
  return [categoryId]
}

export function expandCategoryFilterIds(
  categoryFilters: string[],
  categories: readonly ProductCategory[],
): string[] {
  if (categoryFilters.length === 0) return []
  const expanded = new Set<string>()
  for (const categoryId of categoryFilters) {
    for (const id of getCategoryIdsForSelection(categoryId, categories)) {
      expanded.add(id)
    }
  }
  return [...expanded]
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
